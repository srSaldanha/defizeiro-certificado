import type { Metadata } from "next"
import { Orbitron, Space_Mono } from "next/font/google"
import { Providers } from "@/components/Providers"
import "./globals.css"

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "DefiversoPortalDoDev — DEFIDEV",
  description: "Mint your DEFIDEV NFT on Gnosis Chiado",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${spaceMono.variable}`}>
      <body style={{ fontFamily: "var(--font-space-mono), monospace" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
