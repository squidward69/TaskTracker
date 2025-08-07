import React from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import AuthSuccess from "./components/auth-success";

function App() {
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    // Handle Google OAuth redirect with token
    const urlToken = searchParams.get('token');
    if(urlToken){
      localStorage.setItem("jwt",urlToken);
      // Redirect to dashboard after storing token
      window.location.replace('/');
    }
  }, [searchParams]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Layout>{<Dashboard />}</Layout>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
