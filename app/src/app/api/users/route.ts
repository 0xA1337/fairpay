import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || "");

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const data = await client.searchUser(username || "", undefined, {
      limit: 5,
    });
    const users = data.result.users;
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
