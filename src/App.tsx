import React from "react";
import AppLayout from "./components/layout/AppLayout";
import { StateProvider } from "./state/StateProvider";
import { Toaster } from "react-hot-toast";



const App: React.FC = () => {
  return (
    <StateProvider>
      <AppLayout />
      <Toaster/>
    </StateProvider>
  );
};

export default App;
