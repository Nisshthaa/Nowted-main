import React from "react";
import Layout from "./components/Layout/Layout";
import { AppProvider } from "./context/DataProvider";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <AppProvider>
      <Layout />
      <ToastContainer/>
    </AppProvider>
  );
};

export default App;
