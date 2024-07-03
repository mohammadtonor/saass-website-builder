import { authMiddleware, clerkMiddleware } from "@clerk/nextjs/server";


export default authMiddleware({
    publicRoutes: ['/site', '/api/uploadthing'],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 