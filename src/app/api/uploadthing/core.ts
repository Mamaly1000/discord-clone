import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth as clerkAuth } from "@clerk/nextjs";

const f = createUploadthing();

const auth = () => {
  const { userId } = clerkAuth();
  if (!userId) {
    throw new Error("unAuthorized!");
  }
  return { userId: userId };
};
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => auth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf"])
    .middleware(() => auth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
