// Import necessary dependencies
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import mongoose from "mongoose";
import { Buffer } from "buffer"; 
import { prisma } from "~/server/db";
import { rankResume } from "~/utils/flaskApi";
import { log } from "console";

// Connect to MongoDB
const connectToMongoDB = async () => {
  await mongoose.connect("mongodb+srv://mukeshpilane:123mukesh@cluster0.83vr0ru.mongodb.net/major-project?retryWrites=true&w=majority", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
};

connectToMongoDB();

// Function to store the resume in MongoDB using GridFS
const storeResumeInMongoDB = async (base64Data: string, originalname: string) => {
  // Convert the base64-encoded string back to binary Buffer
  const fileBuffer = Buffer.from(base64Data, "base64");

  const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

  const writeStream = gfs.openUploadStream(originalname);
  writeStream.write(fileBuffer);
  writeStream.end();

  return new Promise<string>((resolve, reject) => {
    writeStream.on("finish", () => {
      resolve(writeStream.id.toString());
    });

    writeStream.on("error", (error) => {
      reject(error);
    });
  });
};

// Define Zod schema for input validation
const uploadResumeInputSchema = z.object({
  file: z.string(),
  userId: z.string(),
  jobId: z.string(),
});

// Create a tRPC router using createTRPCRouter
export const jobApplicationsRouter = createTRPCRouter({
  uploadResume: protectedProcedure
    .input(uploadResumeInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { file, userId, jobId } = input;

        // Assuming 'originalname' is a property provided by your file upload middleware (e.g., Multer)
        const fileObject = {
          fieldname: "resume", // You can adjust these properties as needed
          originalname: "resume.pdf", // Use the originalname from the file metadata
          encoding: "7bit",
          mimetype: "application/pdf",
          buffer: file, // The Buffer content
        };
        
        // Store the resume in MongoDB using GridFS
        const fileId = await storeResumeInMongoDB(
          fileObject.buffer,
          fileObject.originalname
        );
        const copied_file= Buffer.from(file);
        const data = await rankResume(copied_file)
        
        console.log(data);
        
        // Create a record in the database linking the user, job post, and file ID
        const createdJobApplication = await ctx.prisma.jobApplication.create({
          data: {
            fileId: fileId as string,
            userId,
            jobId,
          },
        });

        return createdJobApplication;
      } catch (error) {
        // Handle and log the error
        console.error("Error uploading resume:", error);

        // Return an error response
        throw new Error("Failed to upload resume");
      }
    }),
    getUserJobApplications : protectedProcedure
    .input(z.object({ skip: z.number().default(0), userId: z.string() }))
    .mutation(async ({ input }) => {
      const limit = 5;
      const appliedJobs = await prisma.jobApplication.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          job:{
            include:{
              company:true
            }
          }
        },
        orderBy: [{ createdAt: "desc" }],
        take: limit + 1, // fetch one more tweet than needed
        skip: input.skip || 0,
      });
      const hasMore = appliedJobs?.length > limit;
      if (hasMore) {
        appliedJobs.pop();
      }
      return {
        appliedJobs,
        hasMore,
      };
    }),
    dummy:protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const x = prisma.jobApplication.findFirst({
        where: {
          userId: input.id,
        },
        include: {
          job:{
            include:{
              company:true
            }
          }
        },
      });
      return x
    }),
    hasUserAppliedToAnyJob : protectedProcedure
    .input(z.object({ userId: z.string(), jobId: z.string() }))
    .mutation(async ({ input }) => {
      // Check if the user has applied to any job by querying the jobApplication model
      return prisma.jobApplication.findFirst({
        where: {
          userId : input.userId,
          jobId: input.jobId
        },
      });
    })

});
