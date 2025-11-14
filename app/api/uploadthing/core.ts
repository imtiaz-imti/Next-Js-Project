// Resource: https://docs.uploadthing.com/nextjs/appdir#creating-your-first-fileroute
// Above resource shows how to setup uploadthing. Copy paste most of it as it is.
// We're changing a few things in the middleware and configs of the file upload i.e., "media", "maxFileCount"

// app/api/uploadthing/core.ts
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Helper to get the current user
const getUser = async () => await currentUser();

export const ourFileRouter = {
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new Error("Unauthorized");

      return { userId: user.id }; // accessible in onUploadComplete
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete callback");
      console.log("User:", metadata.userId);
      console.log("File URL:", file.url);

      // THIS IS CRUCIAL — return something so startUpload resolves
      return { fileUrl: file.url, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;





