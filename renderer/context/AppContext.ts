import { createContext } from "react";
import { AppState } from "./AppState";

export const AppContext = createContext<AppState>({});
