import { MintSection } from "@/components/MintSection"
import { GenerateNFT } from "@/components/GenerateNFT"

function AlienSymbol() {
  return (
    <div className="relative w-36 h-36 mx-auto mb-8">
      <svg viewBox="0 0 160 160" className="w-full h-full">
        <circle
          cx="80" cy="80" r="74"
          fill="none" stroke="#39ff14" strokeWidth="1" strokeDasharray="10 5"
          style={{ transformOrigin: "80px 80px", animation: "orbit 14s linear infinite" }}
        />
        <circle
          cx="80" cy="80" r="58"
          fill="none" stroke="#39ff14" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.5"
          style={{ transformOrigin: "80px 80px", animation: "orbit 9s linear infinite reverse" }}
        />
        <circle cx="80" cy="80" r="42" fill="none" stroke="#39ff14" strokeWidth="1" opacity="0.6" />
        <ellipse cx="80" cy="80" rx="30" ry="13" fill="none" stroke="#39ff14" strokeWidth="1.5" opacity="0.9" />
        <circle cx="80" cy="80" r="18" fill="none" stroke="#39ff14" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="10" fill="rgba(57,255,20,0.15)" />
        <circle
          cx="80" cy="80" r="5"
          fill="#39ff14"
          style={{ animation: "glowPulse 2s ease-in-out infinite" }}
        />
      </svg>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000a00] text-[#39ff14] relative overflow-hidden flex flex-col items-center justify-center px-4 py-16">

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.012) 2px, rgba(57,255,20,0.012) 4px)",
        }}
      />

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(57,255,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <AlienSymbol />

        <h1
          className="text-3xl md:text-4xl font-bold tracking-[0.2em] uppercase text-center mb-2"
          style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            textShadow: "0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px rgba(57,255,20,0.4)",
            animation: "flicker 8s step-end infinite",
          }}
        >
          DefiversoPortalDoDev
        </h1>

        <p className="text-[#39ff14]/40 tracking-[0.5em] text-xs mb-12">
          DEFIDEV · GNOSIS CHIADO
        </p>

        <GenerateNFT />

        <div className="w-full max-w-md mx-auto my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#39ff14]/10" />
          <span className="text-[#39ff14]/30 text-xs tracking-[0.4em]">MINT</span>
          <div className="flex-1 h-px bg-[#39ff14]/10" />
        </div>

        <MintSection />

        <div className="mt-12 text-center">
          <p className="text-[#39ff14]/30 text-xs tracking-[0.4em] mb-1">CONTRACT</p>
          <a
            href="https://gnosis-chiado.blockscout.com/address/0x719de80ae50662007538c123b5B2FEe006734E54"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#39ff14]/50 text-xs font-mono hover:text-[#39ff14] transition-colors duration-200"
          >
            0x719de80ae50662007538c123b5B2FEe006734E54
          </a>
        </div>
      </div>
    </main>
  )
}
