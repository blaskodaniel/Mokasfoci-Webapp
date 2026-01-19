import type { Config } from "@/models/config.type";
import { createContext } from "react";

interface ConfigContextType {
  config: Config | undefined;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);
