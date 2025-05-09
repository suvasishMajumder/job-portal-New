import Header from "../components/ui/Header";
import React from "react";
import { Outlet } from "react-router-dom";
import '../App.css'

const AppLayout = () => {
  return (
    <div className="">

      <div className="grid-background"></div>
      <main className="min-h-screen px-10 max-w-screen overflow-x-hidden container">
        <Header />
        <Outlet />
      </main>

      <div className="p-10 mt-10 text-center bg-gray-800 text-red-800">
        Made by Suvasish Majumder with ❤
      </div>
    </div>
  );
};

export default AppLayout;
