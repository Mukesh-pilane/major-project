// Import necessary dependencies
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import mongoose from "mongoose";
import { ObjectId } from 'bson';
import { Buffer } from "buffer"; 
import { prisma } from "~/server/db";
import { rankResume } from "~/utils/flaskApi";

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

const retrieveFileFromMongoDB = async (fileID: string) => {
  const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

  // Create a readable stream to retrieve the file data
  // const id  = new ObjectId("6520482ea299de945fa3e873")
  // const id = new mongoose.Types.ObjectId("6520482ea299de945fa3e873");

  const readStream = gfs.openDownloadStreamByName("resume.pdf"); // Use ObjectId directly
  console.log("readStream",readStream);
  
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    readStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    readStream.on("end", () => {
      const fileData = Buffer.concat(chunks);
      resolve(fileData);
      console.log("fileData",fileData)
    });

    readStream.on("error", (error) => {
      reject(error);
      console.log(error);
      
    });
  });
};


// Define Zod schema for input validation
const uploadResumeInputSchema = z.object({
  file: z.string(),
  userId: z.string(),
  jobId: z.string(),
  jobDescription: z.string(),
});

// Create a tRPC router using createTRPCRouter
export const jobApplicationsRouter = createTRPCRouter({
  uploadResume: protectedProcedure
    .input(uploadResumeInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { file, userId, jobId, jobDescription } = input;

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
        const response = await rankResume(copied_file, jobDescription)
        
        console.log(response);
        
        // Create a record in the database linking the user, job post, and file ID
        const createdJobApplication = await ctx.prisma.jobApplication.create({
          data: {
            fileId: fileId as string,
            userId,
            jobId,
            score: response.score,
            classified : response.classified as string,
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
    hasUserAppliedJob : protectedProcedure
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
    ,
    jobStatus: protectedProcedure
    .input(z.object({ applicationId: z.string(), status: z.enum(["APPLIED","NOT_SELECTED", "SELECTED"]) }))
    .mutation(async ({ input }) => {
      return prisma.jobApplication.update({
        where:{
          id: input.applicationId,
        },
        data:{
          status: input.status
        }
      })
    }),
    getResume: protectedProcedure
    .input(z.object({fileId: z.string()}))
    .mutation(async ({ input }) => {
      const resume = await retrieveFileFromMongoDB(input.fileId)
      return {
        data: resume
      }
    })
});
