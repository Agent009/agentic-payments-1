import { Address } from "viem/accounts";

import { storyClient } from "@story/utils";

// Requester agent can mint a license from the provider agent with specific agreement terms
export const mintLicenceTokens = async ({
  ipId,
  termsId,
  receiver,
  amount = 1,
}: {
  ipId: Address;
  termsId: string;
  receiver: Address;
  amount?: number;
}) => {
  const response = await storyClient.license.mintLicenseTokens({
    licensorIpId: ipId, // the ipId of the asset
    licenseTermsId: termsId, // the license terms id that are attached to the `licensorIpId`
    receiver, // who receives the minted license, i.e. the requester
    amount, // the amount of licenses to mint
    txOptions: { waitForTransaction: true },
  });
  console.log(`License Token minted at transaction hash ${response.txHash}, License IDs: ${response.licenseTokenIds}`);
  return response.licenseTokenIds;
};
