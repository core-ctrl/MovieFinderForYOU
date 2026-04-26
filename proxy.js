import { NextResponse } from "next/server";

const suspiciousAgentPattern = /(sqlmap|nikto|nessus|acunetix|nmap|masscan|zgrab|dirbuster|wpscan)/i;

export function proxy(req) {
  const url = req.nextUrl.clone();
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const userAgent = req.headers.get("user-agent") || "";

  if (process.env.NODE_ENV === "production" && forwardedProto && forwardedProto !== "https") {
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (url.pathname.startsWith("/api/") && suspiciousAgentPattern.test(userAgent)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
