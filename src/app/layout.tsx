import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Provider from "./provider";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight:["100","200","300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ratios App | Imageboard",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider>{children}</Provider>
        </body>
    </html>
  );
}
