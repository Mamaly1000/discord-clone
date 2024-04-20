import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  apiRoutes: ["/api/uploadthing"],
  publicRoutes: ["/api/uploadthing"],
});

export const config = {
  matcher: [
    "/((?!.+.[w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/api/uploadthing",
  ],
};
