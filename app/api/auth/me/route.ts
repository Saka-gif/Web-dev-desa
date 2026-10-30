import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieUser = req.cookies.get("sawotratap_user")?.value;

  if (!cookieUser) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const user = JSON.parse(cookieUser);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
