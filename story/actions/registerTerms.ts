import { Address } from "viem/accounts";

import { commercialRemixTerms, storyClient } from "@story/utils";

export const registerLicenseTerms = async ({ ipId }: { ipId: Address }) => {
  const response = await storyClient.ipAsset.registerPilTermsAndAttach({
    ipId,
    terms: [commercialRemixTerms],
    txOptions: { waitForTransaction: true },
  });
  console.log(`License Terms ${response.licenseTermsIds} attached to IP Asset.`);
};
