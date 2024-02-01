import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Provider from "./provider";
import "./globals.css";
import Auth from "./auth.jsx";
import { Locale, i18n } from "../../../i18n.config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ratios App | Imageboard",
  description: "Generated by create next app",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <Provider>
      <Auth>
        {children}
      </Auth>
    </Provider>
  );
}
