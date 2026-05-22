import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bharat-cream">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
