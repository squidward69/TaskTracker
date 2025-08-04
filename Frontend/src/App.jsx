import React from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Layout from "./components/Layout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
        <Layout> 
          { <Dashboard />}
        </Layout>
} />
        <Route path="/login" element={ <Login />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="*" element={ <PageNotFound />} />

      </Routes>

    </div>
  );
}

export default App;
