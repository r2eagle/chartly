import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

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
  const [isWebflowEnvironment, setIsWebflowEnvironment] = useState(false);
  const isStandaloneMode = !isWebflowEnvironment;

  useEffect(() => {
    // Check immediately
    if (typeof webflow !== 'undefined') {
      setIsWebflowEnvironment(true);
      return;
    }

    // Poll for webflow object (Webflow Designer injects it asynchronously)
    let attempts = 0;
    const maxAttempts = 20; // Check for 2 seconds (20 * 100ms)

    const interval = setInterval(() => {
      attempts++;

      if (typeof webflow !== 'undefined') {
        setIsWebflowEnvironment(true);
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        // After timeout, assume standalone mode
        setIsWebflowEnvironment(false);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <WebflowContext.Provider value={{ isWebflowEnvironment, isStandaloneMode }}>
      {children}
    </WebflowContext.Provider>
  );
};