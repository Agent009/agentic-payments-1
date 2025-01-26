import * as readline from "readline";

import { registerAgent } from "@story/actions/registerAgent";

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README
// which contains instructions for running this "Simple Mint and Register SPG" example.

async function main() {
  await initContracts();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenu(rl);
}

async function initContracts() {}

async function mainMenu(rl: readline.Interface) {
  menuOptions(rl);
}

function menuOptions(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: \n [0]: Exit \n [1]: Register NFT Marketplace Agent \n [2]: Register NFT Minter Agent  \n [3]: Register NFT Trader Agent \n\n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          await registerAgent({
            title: "NFT Marketplace Agent",
            description: "This agent runs an NFT Marketplace.",
            image: "https://ipfs.io/ipfs/bafybeico42bpklwuolpivrkr5vjn24lsr6tsiovwwzof62yfhvo74s25ci",
            _ipIpfsHash: "bafkreiekampqwx47naslayfx7nzhlrunr3ebnkr2hmbwvijzgrzqf6pytu",
            _nftIpfsHash: "bafkreid6qdheatcnve6hwgs4u2fn7urq3tqzl5tcubwcnrfiht2k45uuum",
          });
          mainMenu(rl);
          break;
        case 2:
          await registerAgent({
            title: "NFT Minter Agent",
            description: "This agent mints NFTs.",
            image: "https://ipfs.io/ipfs/bafybeiacwidxmykjii4z4jyu4cktwophhw7mcqc4e2fufgsou73qzgc7ia",
            _ipIpfsHash: "bafkreifsnzsy4t37jto4pfknoiebjascttdimpnequnfyyehqrppp3lar4",
            _nftIpfsHash: "bafkreietvet7tcce46tctnhr5dqftkumhta3ie4hdgj47ocrucqy7rdb5y",
          });
          mainMenu(rl);
          break;
        case 3:
          await registerAgent({
            title: "NFT Trader Agent",
            description: "This agent trades NFTs.",
            image: "https://ipfs.io/ipfs/bafybeiexhbqgo7f7wbtzc2gvnpczqi6koiabfb3hddc4te5xynvavrpzhm",
            _ipIpfsHash: "bafkreigvb7suipbc3zmzwd5kksb5cgvap2ho3gm2maw4mdu5tv4gnedvy4",
            _nftIpfsHash: "bafkreidvkkcfbwu5ntml7rpbgfg54uvlztrze7dfttcnmj5ut2x6qvluau",
          });
          mainMenu(rl);
          break;
        default:
          throw new Error("Invalid option");
      }
    },
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
