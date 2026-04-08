import React from "react";
import { StateProvider } from "./state/StateProvider";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";



const App: React.FC = () => {
  return (
    <StateProvider>
      <AppLayout />
      <Toaster />
    </StateProvider>
  );
};

export default App;
