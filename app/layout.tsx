import "./globals.css";
import type { Metadata } from "next";
import { getBlogSettings } from "@/lib/settings";
import SiteChrome from "@/components/SiteChrome";
import ThemeBoot from "@/components/ThemeBoot";
import { Source_Serif_4, Manrope } from "next/font/google";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBlogSettings();
  return {
    title: settings.siteTitle,
    description: settings.siteSubtitle,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getBlogSettings();

  return (
    <html
      lang="en"
      data-accent={settings.accent}
      data-reader-font={settings.fontPair}
      className={`${serif.variable} ${sans.variable}`}
    >
      <body>
        <ThemeBoot accent={settings.accent} fontPair={settings.fontPair} />
        <div className="min-h-screen">
          <SiteChrome title={settings.siteTitle} />
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
