import { StoryClient } from "@story-protocol/core-sdk";
import { zeroAddress } from "viem";

import { config } from "@story/utils";

const main = async function () {
  const client = StoryClient.newClient(config);

  // Create a new SPG NFT collection
  // You will mostly only have to do this once. Once you get your nft contract address, you can use it in SPG functions.
  const newCollection = await client.nftClient.createNFTCollection({
    name: "Agentic Payments",
    symbol: "AG2AG",
    isPublicMinting: false,
    mintOpen: true,
    mintFeeRecipient: zeroAddress,
    contractURI: "",
    txOptions: { waitForTransaction: true },
  });

  console.log(
    `New SPG NFT collection created at transaction hash ${newCollection.txHash}`,
    `NFT contract address: ${newCollection.spgNftContract}`,
  );
  console.log("createSpgNftCollection -> newCollection", newCollection);
};

main();
