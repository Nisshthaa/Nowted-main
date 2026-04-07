import React from "react";
import Layout from "./components/Layout/Layout";
import { AppProvider } from "./context/DataProvider";
import { Toaster } from "react-hot-toast";



const App: React.FC = () => {
  return (
    <AppProvider>
      <Layout />
      <Toaster/>
    </AppProvider>
  );
};

export default App;
