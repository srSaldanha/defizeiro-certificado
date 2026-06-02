'use client'

import { useState } from 'react'

export function GenerateNFT() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)  // url or data URI
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', { method: 'POST' })
      const data = await res.json()
      if (data.b64) {
        setImageUrl(`data:image/png;base64,${data.b64}`)
      } else if (data.url) {
        setImageUrl(data.url)
      } else {
        setError(data.error ?? 'Falha ao gerar imagem.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative border border-[#39ff14]/20 bg-[#000d00] p-8"
        style={{ boxShadow: '0 0 40px rgba(57,255,20,0.08), inset 0 0 40px rgba(57,255,20,0.03)' }}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#39ff14]/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#39ff14]/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#39ff14]/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#39ff14]/60" />

        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-[#39ff14]/40 text-xs tracking-[0.4em] mb-1">DALL-E 3</p>
            <p
              className="text-[#39ff14] text-sm tracking-[0.25em] font-bold"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              GERAR ARTE NFT
            </p>
          </div>

          {/* Image preview */}
          {imageUrl && (
            <div className="w-full aspect-square border border-[#39ff14]/20 overflow-hidden"
              style={{ boxShadow: '0 0 30px rgba(57,255,20,0.15)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="NFT gerado" className="w-full h-full object-cover" />
            </div>
          )}

          {isLoading && (
            <div className="w-full aspect-square border border-[#39ff14]/10 flex flex-col items-center justify-center gap-4 bg-[#000a00]">
              <div
                className="w-12 h-12 border border-[#39ff14]/30 border-t-[#39ff14]"
                style={{ borderRadius: '50%', animation: 'orbit 1s linear infinite' }}
              />
              <p className="text-[#39ff14]/50 text-xs tracking-[0.3em]">GERANDO...</p>
              <p className="text-[#39ff14]/30 text-xs">pode levar até 30 segundos</p>
            </div>
          )}

          <button
            onClick={generate}
            disabled={isLoading}
            className="w-full py-4 px-6 border border-[#39ff14] bg-transparent text-[#39ff14] font-bold tracking-[0.35em] uppercase text-sm transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: 'inherit' }}
            onMouseEnter={e => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'rgba(57,255,20,0.08)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(57,255,20,0.4)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {isLoading ? '◌  GERANDO...' : imageUrl ? '↺  GERAR OUTRO' : '✦  GERAR ALIEN'}
          </button>

          {imageUrl && !isLoading && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#39ff14]/40 text-xs tracking-widest hover:text-[#39ff14] transition-colors duration-200"
            >
              ↗ ABRIR IMAGEM COMPLETA
            </a>
          )}

          {error && (
            <p className="text-red-400/80 text-xs tracking-wider text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
