// Custom Webflow Designer Extension API Type Declarations
// This file provides minimal type definitions for the Webflow global object
// to avoid dependency on @webflow packages which cause build issues

declare global {
  interface WebflowNotification {
    type: 'Success' | 'Error' | 'Info';
    message: string;
  }

  interface WebflowElementBuilder {
    setTag(tag: string): void;
    setAttribute(name: string, value: string): void;
    append(child: any): void;
  }

  interface WebflowElement {
    type: string;
    children?: WebflowElement[];
    append?(builder: WebflowElementBuilder): Promise<WebflowElement>;
    getChildren?(): Promise<WebflowElement[]>;
    setTag?(tag: string): Promise<void>;
    setAttribute?(name: string, value: string): Promise<void>;
  }

  interface WebflowElementPresets {
    DOM: any;
  }

  interface Webflow {
    // Extension API
    setExtensionSize(size: 'small' | 'default' | 'large'): void;
    notify(notification: WebflowNotification): Promise<void>;

    // Element API
    getSelectedElement(): Promise<WebflowElement | null>;
    elementBuilder(preset: any): WebflowElementBuilder;
    elementPresets: WebflowElementPresets;
  }

  const webflow: Webflow;
}

export {};