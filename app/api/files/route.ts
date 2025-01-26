import { NextResponse, type NextRequest } from "next/server";

import { constants } from "@/lib";
import { pinata } from "@lib/pinata/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file, { groupId: constants.integrations.pinata.groupId });
    const url = await pinata.gateways.convert(uploadData.IpfsHash);
    console.log("api -> POST files -> uploaded", uploadData.IpfsHash, url);
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log("api -> POST files -> error", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
