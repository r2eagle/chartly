import React, { createContext, useContext, ReactNode } from 'react';

interface WebflowContextType {
  isWebflowEnvironment: boolean;
  isStandaloneMode: boolean;
}

const WebflowContext = createContext<WebflowContextType>({
  isWebflowEnvironment: false,
  isStandaloneMode: true,
});

export const useWebflowContext = () => {
  return useContext(WebflowContext);
};

interface WebflowProviderProps {
  children: ReactNode;
}

export const WebflowProvider: React.FC<WebflowProviderProps> = ({ children }) => {
  const isWebflowEnvironment = typeof webflow !== 'undefined';
  const isStandaloneMode = !isWebflowEnvironment;

  return (
    <WebflowContext.Provider value={{ isWebflowEnvironment, isStandaloneMode }}>
      {children}
    </WebflowContext.Provider>
  );
};