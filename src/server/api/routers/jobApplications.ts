// Import necessary dependencies
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import mongoose from "mongoose";

// Connect to MongoDB
const connectToMongoDB = async () => {
  await mongoose.connect("mongodb+srv://mukeshpilane:123mukesh@cluster0.83vr0ru.mongodb.net/major-project?retryWrites=true&w=majority", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
};

connectToMongoDB();

// Function to store the resume in MongoDB using GridFS
const storeResumeInMongoDB = async (fileBuffer: Buffer, originalname: string) => {
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
  file: z.instanceof(Buffer),
  userId: z.string(),
  jobId: z.string(),
});

// Create a tRPC router using createTRPCRouter
export const jobApplicationsRouter = createTRPCRouter({
  uploadResume: protectedProcedure
    .input(uploadResumeInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { file, userId, jobId } = input;

      // Assuming 'originalname' is a property provided by your file upload middleware (e.g., Multer)

      const fileObject = {
        fieldname: "resume", // You can adjust these properties as needed
        originalname: "resume.pdf", // Use the originalname from the file metadata
        encoding: "7bit",
        mimetype: "application/pdf",
        buffer: file, // The Buffer content
      };

      const fileId = await storeResumeInMongoDB(
        fileObject.buffer,
        fileObject.originalname
      );

      // Create a record in the database linking the user, job post, and file ID
      return ctx.prisma.jobApplication.create({
        data: {
          fileId: fileId as string,
          userId,
          jobId,
        },
      });
    }),
});