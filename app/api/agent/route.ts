import { NextResponse } from "next/server";

import { prisma } from "@lib/prisma";
import { registerAgent } from "@story/actions/registerAgent.ts";

export async function POST(request: Request) {
  try {
    // Parse request body as JSON
    const body = await request.json();
    // Destructured body parameters
    const title = "title" in body ? body.title : null;
    const description = "description" in body ? body.description : null;
    const image = "image" in body ? body.image : null;
    const ipIpfsHash = "ipIpfsHash" in body ? body.ipIpfsHash : null;
    const nftIpfsHash = "nftIpfsHash" in body ? body.nftIpfsHash : null;
    const ipaAddress = "ipaAddress" in body ? String(body.ipaAddress) : null;
    const uri = "uri" in body ? body.uri : null;

    // If any required information is missing, return missing info response
    if (!title && !ipaAddress) {
      return NextResponse.json(
        {
          message:
            "Missing info. Either provide metadata to register a new agent, or provide the 'ipaAddress' of an existing agent.",
        },
        { status: 400 },
      );
    }

    // Scenario 1: ipaAddress is provided (existing agent)
    if (ipaAddress) {
      let agent = await prisma.agent.findUnique({
        where: { ipaAddress },
      });

      if (!agent) {
        // Agent not in database, insert new record
        agent = await prisma.agent.create({
          data: {
            title: title || "Unknown Agent",
            description,
            image,
            ipaAddress,
            uri,
          },
        });
      }

      return NextResponse.json(agent);
    }

    // Scenario 2: New agent registration
    if (!title) {
      return NextResponse.json({ message: "Title is required for new agent registration" }, { status: 400 });
    }

    // Register agent using the registerAgent function
    const registrationResult = await registerAgent({
      title,
      description,
      image,
      _ipIpfsHash: ipIpfsHash,
      _nftIpfsHash: nftIpfsHash,
    });

    // Create new agent record in the database
    const newAgent = await prisma.agent.create({
      data: {
        title,
        description,
        image,
        ipaAddress: registrationResult.ipId as string,
        uri,
      },
    });

    return NextResponse.json(newAgent);
  } catch (error) {
    console.error(error, "api -> agent -> POST -> error", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
