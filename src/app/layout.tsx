import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Сетевая топология",
  description: "Визуализация сетевой топологии",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
