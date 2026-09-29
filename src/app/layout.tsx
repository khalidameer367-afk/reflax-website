import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { JsonLd } from "@/components/PageSchema";
import { graph, organizationNode, websiteNode } from "@/lib/schema";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

// Tidio public key (safe to expose). Can be overridden via NEXT_PUBLIC_TIDIO_KEY.
const TIDIO_KEY =
  process.env.NEXT_PUBLIC_TIDIO_KEY ?? "mikvrgrparuxcqesjy6iopsucwkcerox";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Google Search Console ownership verification (renders <meta name="google-site-verification">).
  verification: { google: "0qt-fMsGL6jXQuDHO7fBxN89QlZPiHAjA7w8C-tjNoE" },
  applicationName: SITE_NAME,
  title: "Reflax — Hiring Platform for Experts & Freelancers",
  description:
    "Reflax connects businesses with verified, skilled freelancers and experts across every industry — and helps professionals find real opportunities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <JsonLd data={graph(organizationNode(), websiteNode())} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          src={`https://code.tidio.co/${TIDIO_KEY}.js`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
