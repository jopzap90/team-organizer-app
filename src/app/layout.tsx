import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Pick-Up Games | Organize & Join",
  description: "Create or join pick-up sports games. Share a link, collect GCash, no login required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased min-h-screen bg-slate-950 text-slate-100 flex flex-col`}>
        <main className="flex-1">{children}</main>
        <footer className="py-3 text-center">
          <a
            href="https://forms.gle/HVLKb7oWqkrPduRNA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-400 text-sm"
          >
            Send feedback
          </a>
        </footer>
      </body>
    </html>
  );
}
