import { useContext } from "react";
import { AppState } from "./AppState";

export const useAppState = () => {
  return useContext(AppState)!;
};
