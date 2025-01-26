import { DeliveryStatus, PaymentStatus, RequestStatus, TermsStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { zeroAddress } from "viem";
import { Address } from "viem/accounts";

import { AgentTermsFormulation, NegotiationHistoryEntry } from "@/types";
import { prisma } from "@lib/prisma";
import { createLicense } from "@story/actions/createLicense";
import { mintLicenceTokens } from "@story/actions/mintLicenceTokens";
import { CurrencyAddress, RoyaltyPolicyLAP } from "@story/utils";

export async function POST(request: Request) {
  try {
    const body: AgentTermsFormulation & {
      requestId: string; // Should reference an existing AgentInformationRequest
      agentId: string; // Should identify the calling agent
      termsId?: string; // May reference an existing AgentTermsFormulation record for updates
    } = await request.json();
    const requestId = "requestId" in body ? body.requestId : null;
    const agentId = "agentId" in body ? body.agentId : null;
    const transferable = "transferable" in body ? body.transferable : false;
    const royaltyPolicy = "royaltyPolicy" in body ? body.royaltyPolicy : RoyaltyPolicyLAP;
    const defaultMintingFee = "defaultMintingFee" in body ? body.defaultMintingFee : 1; // costs 1 SUSD to mint a license
    const expiration = "expiration" in body ? body.expiration : undefined;
    const commercialUse = "commercialUse" in body ? body.commercialUse : true;
    const commercialAttribution = "commercialAttribution" in body ? body.commercialAttribution : true;
    const commercializerChecker = "commercializerChecker" in body ? body.commercializerChecker : zeroAddress;
    const commercializerCheckerData =
      "commercializerCheckerData" in body ? (body.commercializerCheckerData as Address) : zeroAddress;
    const commercialRevShare = "commercialRevShare" in body ? body.commercialRevShare : 50; // can claim 50% of derivative revenue
    const commercialRevCeiling = "commercialRevCeiling" in body ? body.commercialRevCeiling : 0;
    const derivativesAllowed = "derivativesAllowed" in body ? body.derivativesAllowed : true;
    const derivativesAttribution = "derivativesAttribution" in body ? body.derivativesAttribution : true;
    const derivativesApproval = "derivativesApproval" in body ? body.derivativesApproval : false;
    const derivativesReciprocal = "derivativesReciprocal" in body ? body.derivativesReciprocal : true;
    const derivativeRevCeiling = "derivativeRevCeiling" in body ? body.derivativeRevCeiling : 0;
    const currency = "currency" in body ? body.currency : CurrencyAddress;
    const uri = "uri" in body ? body.uri : null;

    if (!requestId || !agentId) {
      return NextResponse.json({ message: "Missing required information" }, { status: 400 });
    }

    const agentIR = await prisma.agentInformationRequest.findFirst({
      where: { id: requestId },
    });

    if (!agentIR) {
      return NextResponse.json({ message: "Agent information request doesn't exist." }, { status: 400 });
    }

    let terms;
    const timestamp = new Date().toISOString();

    if (body.termsId) {
      // Update existing terms
      terms = await prisma.agentTermsFormulation.findUnique({
        where: { id: body.termsId },
      });

      if (!terms) {
        return NextResponse.json({ message: "Terms not found" }, { status: 404 });
      }

      type UpdatesType = Partial<Omit<typeof terms, "id" | "requestId" | "agentId">>;
      const updates: UpdatesType = {};

      const historyEntry: NegotiationHistoryEntry = { timestamp, modifiedBy: agentId };

      // Check each field for changes and update accordingly
      for (const [key, value] of Object.entries(body)) {
        if (
          key !== "termsId" &&
          key !== "requestId" &&
          key !== "agentId" &&
          terms[key as keyof typeof terms] !== value
        ) {
          // @ts-expect-error ignore
          updates[key as keyof UpdatesType] = value as UpdatesType[keyof UpdatesType];
          historyEntry[key] = { oldValue: terms[key as keyof typeof terms], newValue: value };
        }
      }

      terms = await prisma.agentTermsFormulation.update({
        where: { id: body.termsId },
        data: {
          ...updates,
          status: TermsStatus.COUNTER_OFFER,
          // @ts-expect-error ignore
          negotiationHistory: {
            push: historyEntry,
            // set: terms.negotiationHistory?.concat(historyEntry),
          },
        },
      });
    } else {
      // Create new terms
      terms = await prisma.agentTermsFormulation.create({
        data: {
          requestId: requestId,
          consumerId: agentIR.requesterId,
          providerId: agentId,
          transferable,
          royaltyPolicy,
          defaultMintingFee,
          expiration,
          commercialUse,
          commercialAttribution,
          commercializerChecker,
          commercializerCheckerData,
          commercialRevShare,
          commercialRevCeiling,
          derivativesAllowed,
          derivativesAttribution,
          derivativesApproval,
          derivativesReciprocal,
          derivativeRevCeiling,
          currency,
          uri,
          status: TermsStatus.DRAFT,
          negotiationHistory: [
            {
              timestamp,
              agentId,
              action: "CREATED",
            },
          ],
        },
      });
    }

    await prisma.agentInformationRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.IN_PROGRESS },
    });

    return NextResponse.json(terms);
  } catch (error) {
    console.error("api -> agent -> negotiate -> POST -> error", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { termsId, agentId, status } = body;

    if (!termsId || !agentId || !status) {
      return NextResponse.json({ message: "Missing required information" }, { status: 400 });
    }

    let terms = await prisma.agentTermsFormulation.findUnique({
      where: { id: termsId },
    });

    if (!terms) {
      return NextResponse.json({ message: "Terms not found" }, { status: 404 });
    }

    const timestamp = new Date().toISOString();

    terms = await prisma.agentTermsFormulation.update({
      where: { id: termsId },
      data: {
        status,
        finalizedAt: status === TermsStatus.FINALIZED ? timestamp : undefined,
        negotiationHistory: {
          push: {
            timestamp,
            modifiedBy: agentId,
            action: status,
          },
        },
      },
    });

    if (status === TermsStatus.FINALIZED) {
      const agentIR = await prisma.agentInformationRequest.update({
        where: { id: terms.requestId },
        data: { status: RequestStatus.COMPLETED },
      });
      const agent = await prisma.agent.findFirst({
        where: { id: agentIR.requesterId },
      });

      if (!agent) {
        return NextResponse.json({ message: "Agent doesn't exist." }, { status: 400 });
      }
      const licenseTermsId: bigint | undefined = await createLicense({
        terms: {
          transferable: terms.transferable,
          royaltyPolicy: terms.royaltyPolicy ? (terms.royaltyPolicy as Address) : RoyaltyPolicyLAP,
          defaultMintingFee: BigInt(terms.defaultMintingFee || 0),
          expiration: terms.expiration
            ? BigInt(Math.floor((new Date(terms.expiration).getTime() - Date.now()) / 1000))
            : BigInt(0), // Convert to seconds from now, or 0 if undefined
          commercialUse: terms.commercialUse,
          commercialAttribution: terms.commercialAttribution,
          commercializerChecker: terms.commercializerChecker ? (terms.commercializerChecker as Address) : zeroAddress,
          commercializerCheckerData: terms.commercializerCheckerData
            ? (terms.commercializerCheckerData as Address)
            : zeroAddress,
          commercialRevShare: terms.commercialRevShare || 50,
          commercialRevCeiling: BigInt(terms.commercialRevCeiling || 0),
          derivativesAllowed: terms.derivativesAllowed,
          derivativesAttribution: terms.derivativesAttribution,
          derivativesApproval: terms.derivativesApproval,
          derivativesReciprocal: terms.derivativesReciprocal,
          derivativeRevCeiling: BigInt(terms.derivativeRevCeiling || 0),
          currency: terms.currency ? (terms.currency as Address) : CurrencyAddress,
          uri: terms.uri ?? "",
        },
      });

      if (!licenseTermsId) {
        return NextResponse.json({ message: "License terms couldn't be created" }, { status: 404 });
      }

      const licenseTokenIds: bigint[] | undefined = await mintLicenceTokens({
        ipId: agentIR.ipId as Address,
        termsId: String(licenseTermsId),
        receiver: agent.ipaAddress as Address,
        amount: 1,
      });

      if (!licenseTokenIds) {
        return NextResponse.json({ message: "License token IDs couldn't be minted" }, { status: 404 });
      }

      // TODO: If asset IP is not registered on Story, then it is registered as the ipID is a prerequisite for minting the license token.
      // TODO: Payment is processed (not sure how as of now)
      // TODO: (optional) Provider provides a secure download link for the asset, stored on IPFS.
      //  This may not be needed as we should already have the asset ipID where we can grab the metadata from.
      // License token is stored.
      const licenseToken = await prisma.licenseToken.create({
        data: {
          termsId: termsId,
          licenseTermsId: Number(licenseTermsId),
          tokenId: Number(licenseTokenIds?.[0] || 0),
          paymentStatus: PaymentStatus.PENDING,
          issuedAt: new Date(),
          expiryDate: terms.expiration,
        },
      });
      // TODO: Consumer confirms receipt of the asset and records the transaction in its memory.
      const ipDelivery = await prisma.iPDelivery.create({
        data: {
          licenseTokenId: licenseToken.id,
          deliveryMedium: "IPFS",
          status: DeliveryStatus.DELIVERED,
          confirmedByReceiver: true,
        },
      });
      const acknowledgement = await prisma.acknowledgment.create({
        data: {
          deliveryId: ipDelivery.id,
          acknowledgedAt: new Date(),
        },
      });
      console.log(
        "api -> agent -> negotiate -> PUT -> ir",
        agentIR.id,
        "terms",
        termsId,
        "licenseTermsId",
        licenseTermsId,
        "licenseTokenIds",
        licenseTokenIds,
        "licenseToken",
        licenseToken.id,
        "ipDelivery",
        ipDelivery.id,
        "acknowledgement",
        acknowledgement.id,
      );
    }

    return NextResponse.json(terms);
  } catch (error) {
    console.error("api -> agent -> negotiate -> PUT -> error", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
