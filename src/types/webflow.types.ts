export interface WebflowElement {
  id: string;
  tag: string;
  textContent?: string;
  children?: WebflowElement[];
  attributes?: Record<string, string>;
  append?: (element: WebflowElement) => Promise<void>;
  setTextContent?: (text: string) => Promise<void>;
}

export interface CMSCollection {
  id: string;
  displayName: string;
  slug: string;
  fields: CMSField[];
}

export interface CMSField {
  id: string;
  displayName: string;
  type: string;
  required?: boolean;
}

export interface CMSItem {
  id: string;
  fieldData: Record<string, any>;
  createdOn: string;
  updatedOn: string;
}

export interface WebflowSiteInfo {
  siteId: string;
  siteName: string;
  shortName: string;
  previewUrl?: string;
}

// Webflow Data API Types for Script Management

export type ScriptLocation = 'head' | 'footer';

export interface RegisterHostedScriptRequest {
  hostedLocation: string;
  version: string;
  displayName: string;
  attributes?: Record<string, string>;
}

export interface RegisterInlineScriptRequest {
  sourceCode: string;
  version: string;
  displayName: string;
  location?: ScriptLocation;
}

export interface RegisteredScript {
  id: string;
  version: string;
  displayName: string;
  location?: ScriptLocation;
  createdOn: string;
}

export interface ApplyScriptRequest {
  scripts: Array<{
    id: string;
    location: ScriptLocation;
  }>;
}

export interface DataApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ScriptInstallationResult {
  success: boolean;
  message: string;
  error?: string;
  instructions?: typeof import('../constants/scripts').MANUAL_INSTALLATION_INSTRUCTIONS;
  scriptIds?: {
    chartJs: string;
    runtime: string;
  };
}