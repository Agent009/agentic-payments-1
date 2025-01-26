import { Home, Sun, Star, CalendarDays, Calendar, BarChart2 } from "lucide-react";

const currentYear = new Date().getFullYear().toString();

const name = "Agent-to-Agent Payments App";
const caption = "AI-Powered Agent-to-Agent Payments App";
const email = "info@connextar.com";
const registeredIn = "England & Wales";
const companyCopyright = `©Copyright ${currentYear}, Connextar Technologies Ltd. All Rights Reserved.`;

// Environment
const environment = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development";
const localEnv = environment === "local";
const prodEnv = ["production", "prod"].includes(environment);
const devEnv = !localEnv && !prodEnv;
const devOrLocalEnv = devEnv || localEnv;
// Core Web App (CWA)
const cwaServerHost = process.env.CWA_SERVER_HOST || "http://localhost";
const cwaServerPort = process.env.CWA_SERVER_PORT || 3000;
const cwaServerUrl = process.env.NEXT_PUBLIC_CWA_SERVER_URL || `${cwaServerHost}:${cwaServerPort}`;

export const constants = Object.freeze({
  account: {
    walletPrivateKey: process.env.WALLET_PRIVATE_KEY || "",
  },
  // Environment
  env: {
    dev: devEnv,
    local: localEnv,
    devOrLocal: devOrLocalEnv,
    prod: prodEnv,
  },
  // CWA
  cwa: {
    host: cwaServerHost,
    port: cwaServerPort,
    url: cwaServerUrl,
  },
  app: {
    id: "fb-web-app",
    name: name,
    productionUrl: "https://task.app",
    repoUrl: "https://github.com/Connextar/cx-tasks",
    caption: caption,
    title: name + " - " + caption,
    email: email,
    registeredIn,
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
    socials: {
      twitter: "https://x.com/connextar",
    },
    companyNo: "08524460",
    companyCopyright,
  },
  routes: {
    home: "/",
    contact: "/contact",
    terms: "/terms",
    privacy: "/privacy",
    sitemap: "/sitemap.xml",
    auth: {
      error: "/auth/error",
      login: "/auth/signin",
      logout: "/auth/signout",
      verifyRequest: "/auth/verify-request",
    },
    api: {
      base: cwaServerUrl + (cwaServerUrl?.charAt(cwaServerUrl?.length - 1) !== "/" ? "/" : "") + "api/",
      contact: "contact",
      files: "files",
      settings: "settings",
    },
  },
  sidebarLinks: [
    {
      title: "My Day",
      icon: Sun,
      href: "/my-day",
    },
    {
      title: "Important",
      icon: Star,
      href: "/important",
    },
    {
      title: "Planned",
      icon: CalendarDays,
      href: "/planned",
    },
    {
      title: "This Week",
      icon: Calendar,
      href: "/this-week",
    },
    {
      title: "Tasks",
      icon: Home,
      href: "/tasks",
    },
    {
      title: "Analytics",
      icon: BarChart2,
      href: "/analytics",
    },
  ],
  social: {
    linkedIn: "https://www.linkedin.com/company/connextar-technologies-ltd",
    facebook: "https://www.facebook.com/p/Connextar-Technologies-Ltd-100069706274678",
    twitter: "https://x.com/connextar",
  },
  integrations: {
    alchemy: {
      apiKey: process.env.ALCHEMY_API_KEY || "",
      sepolia: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`,
    },
    openAI: {
      useLocal: "true" === process.env.USE_LOCAL_AI,
      localBaseURL: process.env.LOCAL_AI_BASE_URL || "",
      apiKey: process.env.OPENAI_API_KEY || "",
      models: {
        chat: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      },
      temperature: 0.5,
      maxTokens: 500,
      promptTypes: {
        chat: "chat",
      },
      response: {
        default: "default",
        streaming: "streaming",
      },
    },
    pinata: {
      gateway: process.env.NEXT_PUBLIC_GATEWAY_URL || "",
      jwt: process.env.PINATA_JWT || "",
      groupId: process.env.PINATA_IPFS_GROUP_ID || "",
    },
    sendGrid: {
      apiKey: process.env.SENDGRID_API_KEY || "",
      from: process.env.EMAIL_FROM || email,
      contactEmail: email,
    },
    story: {
      rpcProviderUrl: process.env.RPC_PROVIDER_URL || "https://odyssey.storyrpc.io",
      currencyAddress: process.env.CURRENCY_ADDRESS || "0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5",
      spgNFTContractAddress: process.env.SPG_NFT_CONTRACT_ADDRESS || "0x6Ef8AFFbD08d7338894a37C5f4D1E68743DfDF9C",
      nftMarketplaceAgentIpaAddress:
        process.env.NFT_MARKETPLACE_AGENT_IPA_ADDRESS || "0x54d132eB067e1FaA1e33bc6dDB4e3c4b51EDc0dc",
      nftMarketplaceAgentTokenId: BigInt(process.env.NFT_MARKETPLACE_AGENT_TOKEN_ID as string) || 42n,
      nftMarketplaceAgentLicenceTermsIds: [BigInt(process.env.NFT_MARKETPLACE_AGENT_LICENSE_TERMS_IDS as string)],
      nftMinterAgentIpaAddress:
        process.env.NFT_MINTER_AGENT_IPA_ADDRESS || "0x398811Ff40Ce783738405D9ED1eaE7a7e79C95A3",
      nftMinterAgentTokenId: BigInt(process.env.NFT_MINTER_AGENT_TOKEN_ID as string) || 42n,
      nftMinterAgentLicenceTermsIds: [BigInt(process.env.NFT_MINTER_AGENT_LICENSE_TERMS_IDS as string)],
      nftTraderAgentIpaAddress:
        process.env.NFT_TRADER_AGENT_IPA_ADDRESS || "0x3Fd5cedcBaAebe32C9d18650332C9be2F83e3609",
      nftTraderAgentTokenId: BigInt(process.env.NFT_TRADER_AGENT_TOKEN_ID as string) || 42n,
      nftTraderAgentLicenceTermsIds: [BigInt(process.env.NFT_TRADER_AGENT_LICENSE_TERMS_IDS as string)],
    },
  },
  l: {
    dt: {
      displayDateFormat: "dd/MM/yyyy",
    },
  },
});
