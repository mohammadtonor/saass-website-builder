import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "process";


export default authMiddleware({
    publicRoutes: ['/site', '/api/uploadthing'],
    async beforeAuth(auth, req) {},
    async afterAuth(auth, req, evt) {
      const url = req.nextUrl;
      const searchParams = url.searchParams.toString();
      let hostname = req.headers;

      const pathWithSearchParams = `${url.pathname}${
        searchParams.length > 0 ? `?${url.pathname}` : ""
      }`;

      const customSubdomain = hostname
        .get("host")
        ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
        .filter(Boolean)[0];

      if (customSubdomain) {
        return NextResponse.rewrite(new URL(`/${customSubdomain}${pathWithSearchParams}`));
      }

      if(url.pathname === '/sign-in' || url.pathname === '/sign-up') {
        return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
      }

      if(url.pathname === '/' || url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN) {
        return NextResponse.rewrite(new URL('/site', req.url));
      }

      if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
        return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
      }
    }, 
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 