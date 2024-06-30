import { authMiddleware } from "@clerk/nextjs/server";
export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: ["/", "/api/webhook/clerk"],
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};