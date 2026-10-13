import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "MP4 rendering is not connected yet. The actual wedding invitation composition must be connected before export.",
    },
    { status: 501 }
  );
}
