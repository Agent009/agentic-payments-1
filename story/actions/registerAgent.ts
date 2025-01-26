import { createHash } from "crypto";

import {
  GenerateIpMetadataParam,
  IpMetadata,
  MintAndRegisterIpAssetWithPilTermsResponse,
} from "@story-protocol/core-sdk";
import axios from "axios";
import { zeroAddress } from "viem";

import { constants } from "@/lib";
import { uploadJSONToIPFS } from "@lib/pinata/server";
import { commercialRemixTerms, SPGNFTContractAddress, storyClient } from "@story/utils";

export const generateAgentIpMetadata = ({
  title,
  description,
  ipType = "AI Agent",
  role = "General Purpose",
}: {
  title: string;
  description?: string;
  ipType?: string;
  role?: string;
}): GenerateIpMetadataParam => {
  return {
    title,
    description: description || "AI Agent",
    ipType,
    creators: [
      {
        name: "Mohammad Amir",
        address: zeroAddress,
        contributionPercent: 100,
        description: "",
        socialMedia: [
          { platform: "github", url: "https://github.com/Agent009" },
          { platform: "linkedin", url: "https://www.linkedin.com/in/amir1988/" },
          { platform: "facebook", url: constants.social.facebook },
          { platform: "twitter", url: constants.social.twitter },
        ],
      },
    ],
    attributes: [
      {
        key: "role",
        value: role,
      },
    ],
    tags: ["Benjamin", "Unleash Protocol", "Story", "AI Agent", "IPFI"],
  };
};
export const generateAgentNftMetadata = ({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) => {
  return {
    name: title,
    description: description || "AI Agent",
    image: image ?? "https://ipfs.io/ipfs/bafybeico42bpklwuolpivrkr5vjn24lsr6tsiovwwzof62yfhvo74s25ci",
  };
};

export const registerAgent = async ({
  title,
  description,
  image,
  _ipIpfsHash,
  _nftIpfsHash,
}: {
  title: string;
  description?: string;
  image?: string;
  _ipIpfsHash?: string;
  _nftIpfsHash?: string;
}) => {
  // Upload the IP and NFT Metadata to IPFS
  let ipMetadata: IpMetadata;
  let ipIpfsHash = _ipIpfsHash;
  let nftMeta: object;
  let nftIpfsHash = _nftIpfsHash;

  if (_ipIpfsHash) {
    console.log("registerAgent -> IP metadata already uploaded to IPFS");
    // Retrieve the existing metadata from IPFS based on the provided hash. Assume a JSON payload.
    try {
      const response = await axios.get(`https://${constants.integrations.pinata.gateway}/ipfs/${ipIpfsHash}`, {
        timeout: 5000,
      });
      ipMetadata = response.data as IpMetadata;
    } catch (error) {
      console.error("registerAgent -> Error retrieving IP metadata from IPFS -> ", error);
      throw new Error("Failed to retrieve IP metadata from IPFS");
    }
  } else {
    ipMetadata = storyClient.ipAsset.generateIpMetadata(generateAgentIpMetadata({ title, description }));
    const ipIpfsHashData = await uploadJSONToIPFS(title, ipMetadata);
    ipIpfsHash = ipIpfsHashData.ipfsHash;
  }

  if (_nftIpfsHash) {
    console.log("registerAgent -> NFT metadata already uploaded to IPFS");
    // Retrieve the existing metadata from IPFS based on the provided hash. Assume a JSON payload.
    try {
      const response = await axios.get(`https://${constants.integrations.pinata.gateway}/ipfs/${ipIpfsHash}`, {
        timeout: 5000,
      });
      nftMeta = response.data as object;
    } catch (error) {
      console.error("registerAgent -> Error retrieving NFT metadata from IPFS -> ", error);
      throw new Error("Failed to retrieve NFT metadata from IPFS");
    }
  } else {
    nftMeta = generateAgentNftMetadata({ title, description, image });
    const nftIpfsHashData = await uploadJSONToIPFS(title, nftMeta);
    nftIpfsHash = nftIpfsHashData.ipfsHash;
  }

  const ipHash = createHash("sha256").update(JSON.stringify(ipMetadata)).digest("hex");
  const nftHash = createHash("sha256").update(JSON.stringify(nftMeta)).digest("hex");

  // Register the NFT as an IP Asset
  // Docs: https://docs.story.foundation/docs/attach-terms-to-an-ip-asset#mint-nft-register-as-ip-asset-and-attach-terms
  const response: MintAndRegisterIpAssetWithPilTermsResponse =
    await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: SPGNFTContractAddress,
      terms: [commercialRemixTerms],
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });
  console.log(`registerAgent -> Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`);
  console.log(`registerAgent -> View on the explorer: https://odyssey.explorer.story.foundation/ipa/${response.ipId}`);
  console.log("registerAgent -> response", response);
  return response;
};
