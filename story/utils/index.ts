import { LicenseTerms, StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http, zeroAddress } from "viem";
import { Account, Address, privateKeyToAccount } from "viem/accounts";

import { constants } from "@lib/constants";

const privateKey: Address = `0x${constants.account.walletPrivateKey}`;
export const account: Account = privateKeyToAccount(privateKey);
// This is a pre-configured PIL Flavor: https://docs.story.foundation/docs/pil-flavors
export const NonCommercialSocialRemixingTermsId = "1";
export const NFTMarketplaceAgentIpaAddress: Address = constants.integrations.story
  .nftMarketplaceAgentIpaAddress as Address;
export const SPGNFTContractAddress: Address = constants.integrations.story.spgNFTContractAddress as Address;
export const NFTMinterAgentIpaAddress: Address = constants.integrations.story.nftMinterAgentIpaAddress as Address;
export const NFTTraderAgentIpaAddress: Address = constants.integrations.story.nftTraderAgentIpaAddress as Address;
// You can select from one of these RPCs: https://docs.story.foundation/docs/story-network#-rpcs
export const RPCProviderUrl = constants.integrations.story.rpcProviderUrl;
// The currency used for paying License Tokens or tipping. This address must be whitelisted by the protocol.
// You can see the currently whitelisted addresses here:
// https://docs.story.foundation/docs/royalty-module#whitelisted-revenue-tokens
export const CurrencyAddress: Address = constants.integrations.story.currencyAddress as Address;
// Docs: https://docs.story.foundation/docs/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address = "0x28b4F70ffE5ba7A26aEF979226f77Eb57fb9Fdb6";

// Docs: https://docs.story.foundation/docs/typescript-sdk-setup
export const config: StoryConfig = {
  account: account,
  transport: http(RPCProviderUrl),
  chainId: "odyssey",
};

// Set up Story Config
// Docs: https://docs.story.foundation/docs/typescript-sdk-setup
export const storyClient = StoryClient.newClient(config);

export const commercialRemixTerms: LicenseTerms = {
  transferable: true,
  royaltyPolicy: RoyaltyPolicyLAP,
  defaultMintingFee: BigInt(0),
  expiration: BigInt(0),
  commercialUse: true,
  commercialAttribution: true,
  commercializerChecker: zeroAddress,
  commercializerCheckerData: zeroAddress,
  commercialRevShare: 50, // can claim 50% of derivative revenue
  commercialRevCeiling: BigInt(0),
  derivativesAllowed: true,
  derivativesAttribution: true,
  derivativesApproval: false,
  derivativesReciprocal: true,
  derivativeRevCeiling: BigInt(0),
  currency: CurrencyAddress,
  uri: "",
};
