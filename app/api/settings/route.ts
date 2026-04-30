import { NextResponse } from "next/server";
import { getBlogSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getBlogSettings();
  return NextResponse.json(settings);
}
