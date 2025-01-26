import { NextResponse } from "next/server";

import { prisma } from "@lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse request body as JSON
    const body = await request.json();
    // Destructured body parameters
    const requesterId = "requesterId" in body ? body.requesterId : null;
    const ipType = "ipType" in body ? body.ipType : null;
    const ipId = "ipId" in body ? body.ipId : null;
    const ipUri = "ipUri" in body ? body.ipUri : null;
    const proposedUsage = "proposedUsage" in body ? body.proposedUsage : null;
    const duration = "duration" in body ? body.duration : null;

    // If any required information is missing, return missing info response
    if (!requesterId || !ipType || !proposedUsage || !duration || !ipUri) {
      return NextResponse.json({ message: "Missing info" }, { status: 400 });
    }

    // Create new agent information request in the database
    const record = await prisma.agentInformationRequest.create({
      data: {
        requester: requesterId,
        ipType,
        ipId,
        ipUri,
        proposedUsage,
        duration,
      },
    });

    // Query requests by status
    // const pendingRequests = await prisma.agentInformationRequest.findMany({
    //   where: { status: RequestStatus.PENDING },
    // });

    // Update the status of a request
    // const updatedRequest = await prisma.agentInformationRequest.update({
    //   where: { id: "request_id_here" },
    //   data: { status: RequestStatus.PROCESSING },
    // });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error, "api -> agent -> request -> POST -> error", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
