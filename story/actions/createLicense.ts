import { LicenseTerms } from "@story-protocol/core-sdk";

import { commercialRemixTerms, storyClient } from "@story/utils";

export const createLicense = async ({ terms }: { terms: LicenseTerms }) => {
  const response = await storyClient.license.registerPILTerms({
    ...commercialRemixTerms,
    ...terms,
    txOptions: { waitForTransaction: true },
  });
  console.log(`(tx ${response.txHash}) License Terms ${response.licenseTermsId} created.`);
  return response.licenseTermsId;
};
