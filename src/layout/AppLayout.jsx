import Header from "../components/ui/Header";
import React from "react";
import { Outlet } from "react-router-dom";
import '../App.css'
import Footer from "@/components/Footer";


const AppLayout = () => {
  return (
    <>
    <div className="">

      <div className="grid-background"></div>
      <main className="min-h-screen px-10 my-10 max-w-screen overflow-x-hidden container">
        <Header />
        <Outlet />
      </main>

    <Footer />
    </div>
    </>
  );
};

export default AppLayout;
