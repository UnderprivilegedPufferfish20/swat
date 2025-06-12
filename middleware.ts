import { auth } from "./src/lib/auth";
import { NextResponse } from "next/server";

export default auth((req:any) => {
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, "/login");
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/protected/:path*"],
};