// Types derived from the A2A AgentCard specification

export interface AgentCard {
  name: string;
  description: string;
  version: string;
  protocolVersion?: string;
  url: string;
  preferredTransport?: string;
  iconUrl?: string;
  documentationUrl?: string;
  capabilities: AgentCapabilities;
  skills: AgentSkill[];
  defaultInputModes: string[];
  defaultOutputModes: string[];
  provider?: AgentProvider;
  additionalInterfaces?: AgentInterface[];
  security?: SecurityRequirement[];
  securitySchemes?: { [key: string]: SecurityScheme };
  signatures?: AgentCardSignature[];
  supportsAuthenticatedExtendedCard?: boolean;
}

export interface AgentCapabilities {
  streaming?: boolean;
  pushNotifications?: boolean;
  stateTransitionHistory?: boolean;
  extensions?: AgentExtension[];
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  examples?: string[];
  inputModes?: string[];
  outputModes?: string[];
  security?: SecurityRequirement[];
}

export interface AgentProvider {
  organization: string;
  url: string;
}

export interface AgentInterface {
  url: string;
  transport: string;
}

export interface AgentExtension {
  uri: string;
  description?: string;
  required: boolean;
  params?: { [key: string]: unknown };
}

export interface SecurityRequirement {
  [key: string]: string[];
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect' | 'mutualTLS';
  description?: string;
  // Additional fields depend on type
  [key: string]: unknown;
}

export interface AgentCardSignature {
  protected: string;
  signature: string;
  header?: { [key: string]: unknown };
}

export const TRANSPORT_PROTOCOLS = ['JSONRPC', 'GRPC', 'HTTP+JSON'] as const;
export type TransportProtocol = typeof TRANSPORT_PROTOCOLS[number];