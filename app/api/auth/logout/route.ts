import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Anda telah berhasil keluar.",
  });

  response.cookies.delete("sawotratap_user");
  return response;
}
