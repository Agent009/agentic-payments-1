import type { Prisma } from "@prisma/client";

export type CredentialsType = {
  email: {
    label: string;
    type: string;
  };
  password: {
    label: string;
    type: string;
  };
};

export type Notification = Prisma.NotificationGetPayload<object>;

export type AgentInformationRequest = Prisma.AgentInformationRequestGetPayload<object>;

export type AgentTermsFormulation = Prisma.AgentTermsFormulationGetPayload<object>;

export interface AgentTermsAcceptance {
  request_id: string;
  license_token: string;
  payment: string;
}

export interface NegotiationHistoryEV {
  oldValue: unknown;
  newValue: unknown;
}

export interface NegotiationHistoryEntry {
  timestamp: string;
  modifiedBy: string;

  [key: string]: string | NegotiationHistoryEV;
}
