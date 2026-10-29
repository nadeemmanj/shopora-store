import "./globals.css";
import { Suspense } from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ToastProvider from "../components/ToastProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartProvider from "../components/CartProvider";


export const metadata: Metadata = {
  title: "Shopora | Shop Smart, Live Beautiful",
  description: "Shopora - Shop Smart, Live Beautiful",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
           <CartProvider>
          <Suspense fallback={<div className="h-16 bg-white shadow-sm" />}>
            <Navbar />
          </Suspense>
          <main>{children}</main>
          <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
