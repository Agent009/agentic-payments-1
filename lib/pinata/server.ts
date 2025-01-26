"server only";

import { PinataSDK } from "pinata-web3";

import { constants } from "@lib/constants";

export const pinata = new PinataSDK({
  pinataJwt: `${constants.integrations.pinata.jwt}`,
  pinataGateway: `${constants.integrations.pinata.gateway}`,
});

export async function uploadJSONToIPFS(name: string, jsonMetadata: object): Promise<{ ipfsHash: string; url: string }> {
  const uploadData = await pinata.upload.json(jsonMetadata, {
    metadata: { name },
    groupId: constants.integrations.pinata.groupId,
  });
  const ipfsHash = uploadData.IpfsHash;
  const url = await pinata.gateways.convert(ipfsHash);
  console.log("lib -> piñata -> server -> uploadJSONToIPFS -> IpfsHash", ipfsHash, "url", url);
  return { ipfsHash, url };
}
