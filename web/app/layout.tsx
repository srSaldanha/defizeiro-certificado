import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Defizeiro Certificado",
  description: "Plataforma de certificados on-chain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
