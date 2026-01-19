import type { Config } from "@/models/config.type";
import Api from "@/services/service";
import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";
import { ConfigContext } from "./ConfigContext";

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<Config>();

  useEffect(() => {
    const getConfigData = async () => {
      try {
        const resp = await Api.getConfigs();
        if (resp) setConfig(resp);
      } catch (err: unknown) {
        console.error("Error during get configs", err);
      }
    };
    getConfigData();
  }, []);

  const value = useMemo(() => ({ config }), [config]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
