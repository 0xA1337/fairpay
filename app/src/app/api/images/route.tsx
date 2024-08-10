import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { ALLOWED_IMAGE_TYPES } from "@/shared/constants";
import { PinataFileUploadRes } from "@/shared/types/ipfs";
import { buildIpfsUrl } from "@/shared/utils/ipfs";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    console.log("===+> received");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG and PNG are allowed" },
        { status: 400 }
      );
    }

    const fileName = `fairpay-${crypto.randomUUID()}${path.extname(file.name)}`;

    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify({ name: fileName }));

    const result = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_API_KEY}`,
      },
      body: formData,
    });

    const data: PinataFileUploadRes = await result.json();

    const url = buildIpfsUrl(data.IpfsHash);
    return NextResponse.json({ hash: data.IpfsHash, url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
