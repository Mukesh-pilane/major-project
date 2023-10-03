// Import necessary dependencies
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import mongoose from "mongoose";
import { Buffer } from "buffer"; 
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
    
});
