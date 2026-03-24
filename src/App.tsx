import React from "react";
import Layout from "./components/Layout/Layout";
import { AppProvider } from "./context/DataProvider";

const App: React.FC = () => {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
};

export default App;
