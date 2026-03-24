import { useContext } from "react";
import { DataContext } from "./DataContext";

export const useApp = () => {
  return useContext(DataContext)!;
};