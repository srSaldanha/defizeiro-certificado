'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CONTRACT_ADDRESS, ABI } from '@/lib/contract'
import type { NFTTraits } from '@/app/api/generate/route'

type Stage = 'idle' | 'generating' | 'preview' | 'confirming' | 'minting' | 'success'

const TRAIT_LABELS: Record<string, string> = {
  Pele: '🎨 Pele',
  Crânio: '💀 Crânio',
  Olhos: '👁 Olhos',
  Boca: '👄 Boca',
  Extras: '✦ Extras',
  'Item Cripto': '₿ Item Cripto',
  Pose: '⚡ Pose',
  Cenário: '🌌 Cenário',
  Estilo: '🖌 Estilo',
}

function TraitsPanel({ traits }: { traits: NFTTraits }) {
  const entries = Object.entries(traits) as [keyof NFTTraits, NFTTraits[keyof NFTTraits]][]
  return (
    <div className="w-full border border-[#39ff14]/15 bg-[#000a00]">
      <div className="px-4 py-2 border-b border-[#39ff14]/15">
        <p className="text-[#39ff14]/50 text-xs tracking-[0.4em]">ATRIBUTOS</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-[#39ff14]/10">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-[#000a00] px-3 py-2">
            <p className="text-[#39ff14]/40 text-xs tracking-wider mb-1">
              {TRAIT_LABELS[key] ?? key}
            </p>
            <p className="text-[#39ff14] text-xs font-bold leading-tight">
              {Array.isArray(value) ? value.join(', ') : value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GlowButton({
  onClick,
  disabled,
  children,
  dim,
}: {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  dim?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 px-6 border border-[#39ff14] bg-transparent text-[#39ff14] font-bold tracking-[0.35em] uppercase text-sm transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ fontFamily: 'inherit', opacity: dim ? 0.5 : 1 }}
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
      {children}
    </button>
  )
}

export function MintSection() {
  const { address, isConnected } = useAccount()

  const [stage, setStage] = useState<Stage>('idle')
  const [imageDataUri, setImageDataUri] = useState<string | null>(null)
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null)
  const [traits, setTraits] = useState<NFTTraits | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const { data: totalSupply, refetch: refetchSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalSupply',
  })

  const { data: alreadyMinted, refetch: refetchMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { writeContract, data: txHash, isPending, error: txError, reset: resetTx } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (isPending) setStage('confirming')
  }, [isPending])

  useEffect(() => {
    if (isConfirming) setStage('minting')
  }, [isConfirming])

  useEffect(() => {
    if (isSuccess) {
      setStage('success')
      refetchSupply()
      refetchMinted()
    }
  }, [isSuccess, refetchSupply, refetchMinted])

  useEffect(() => {
    if (txError && (stage === 'confirming' || stage === 'minting')) {
      setStage('preview')
    }
  }, [txError, stage])

  const handleMintClick = async () => {
    resetTx()
    setGenerateError(null)
    setStage('generating')

    try {
      const res = await fetch('/api/generate', { method: 'POST' })
      const data = await res.json()

      if (data.imageUrl) {
        setImageDataUri(data.imageUrl)
        setMetadataUrl(data.metadataUrl ?? null)
        setTraits(data.traits ?? null)
        setStage('preview')
      } else {
        setGenerateError(data.error ?? 'Falha ao gerar imagem.')
        setStage('idle')
      }
    } catch {
      setGenerateError('Erro de conexão ao gerar imagem.')
      setStage('idle')
    }
  }

  const handleConfirmMint = () => {
    if (!metadataUrl) return
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'mint',
      args: [metadataUrl],
    })
  }

  const handleCancel = () => {
    setStage('idle')
    setImageDataUri(null)
    setMetadataUrl(null)
    setTraits(null)
    setGenerateError(null)
    resetTx()
  }

  const supply = totalSupply !== undefined ? Number(totalSupply) : null
  const progress = supply !== null ? (supply / 1000) * 100 : 0

  const txErrorMessage = (() => {
    if (!txError) return null
    const msg = txError.message
    if (msg.includes('User rejected') || msg.includes('user rejected')) return 'Transação cancelada.'
    if (msg.includes('Already minted')) return 'Esta carteira já mintou.'
    if (msg.includes('Max supply')) return 'Supply máximo atingido.'
    return 'Transação falhou. Tente novamente.'
  })()

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Supply stats */}
      <div className="text-center mb-8">
        <div className="flex items-end justify-center gap-3">
          <span className="text-6xl font-bold text-[#39ff14]"
            style={{ textShadow: '0 0 10px #39ff14, 0 0 30px #39ff14' }}>
            {supply ?? '—'}
          </span>
          <span className="text-2xl text-[#39ff14]/40 mb-2 font-light">/ 1000</span>
        </div>
        <p className="text-[#39ff14]/40 text-xs tracking-[0.4em] mt-1">MINTED</p>
        <div className="mt-4 h-px bg-[#39ff14]/10 w-full overflow-hidden">
          <div className="h-full bg-[#39ff14] transition-all duration-1000"
            style={{ width: `${progress}%`, boxShadow: '0 0 8px #39ff14' }} />
        </div>
      </div>

      {/* Main card */}
      <div className="relative border border-[#39ff14]/20 p-8 bg-[#000d00]"
        style={{ boxShadow: '0 0 40px rgba(57,255,20,0.08), inset 0 0 40px rgba(57,255,20,0.03)' }}>

        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#39ff14]/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#39ff14]/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#39ff14]/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#39ff14]/60" />

        <div className="flex flex-col items-center gap-6">

          {/* NOT CONNECTED */}
          {!isConnected ? (
            <>
              <p className="text-[#39ff14]/50 text-xs tracking-[0.35em] text-center">
                CONNECT YOUR WALLET TO MINT
              </p>
              <ConnectButton />
            </>

          /* ALREADY MINTED */
          ) : alreadyMinted ? (
            <div className="text-center py-4">
              <div className="text-4xl text-[#39ff14]/60 mb-4">◈</div>
              <p className="text-[#39ff14] tracking-[0.3em] font-bold">ALREADY CLAIMED</p>
              <p className="text-[#39ff14]/40 text-xs tracking-widest mt-3">THIS WALLET HAS MINTED A DEFIDEV</p>
            </div>

          /* SUCCESS */
          ) : stage === 'success' ? (
            <div className="flex flex-col items-center gap-4 w-full">
              {imageDataUri && (
                <div className="w-full aspect-square border border-[#39ff14]/30 overflow-hidden"
                  style={{ boxShadow: '0 0 40px rgba(57,255,20,0.25)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageDataUri} alt="Seu NFT" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-center">
                <p className="text-[#39ff14] tracking-[0.3em] font-bold text-lg"
                  style={{ textShadow: '0 0 10px #39ff14' }}>
                  ✦ MINT SUCCESSFUL
                </p>
                <p className="text-[#39ff14]/50 text-xs tracking-widest mt-2">WELCOME TO THE DEFIVERSO</p>
              </div>
              {traits && <TraitsPanel traits={traits} />}
              {metadataUrl && (
                <a href={metadataUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[#39ff14]/40 text-xs tracking-widest hover:text-[#39ff14] transition-colors duration-200">
                  ↗ VER METADATA JSON
                </a>
              )}
            </div>

          /* GENERATING */
          ) : stage === 'generating' ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-full aspect-square border border-[#39ff14]/10 flex flex-col items-center justify-center gap-4 bg-[#000a00]">
                <div className="w-12 h-12 border border-[#39ff14]/30 border-t-[#39ff14] rounded-full"
                  style={{ animation: 'orbit 1s linear infinite' }} />
                <p className="text-[#39ff14]/50 text-xs tracking-[0.3em]">GERANDO SEU ALIEN...</p>
                <p className="text-[#39ff14]/30 text-xs">pode levar até 30 segundos</p>
              </div>
            </div>

          /* PREVIEW — image ready, waiting for user to confirm */
          ) : stage === 'preview' ? (
            <div className="flex flex-col items-center gap-4 w-full">
              {imageDataUri && (
                <div className="w-full aspect-square border border-[#39ff14]/30 overflow-hidden"
                  style={{ boxShadow: '0 0 30px rgba(57,255,20,0.15)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageDataUri} alt="Prévia do NFT" className="w-full h-full object-cover" />
                </div>
              )}
              {traits && <TraitsPanel traits={traits} />}
              <p className="text-[#39ff14]/50 text-xs tracking-[0.3em] text-center">
                SEU ALIEN ESTÁ PRONTO — CONFIRMAR MINT?
              </p>
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
              <GlowButton onClick={handleConfirmMint}>⬡  CONFIRMAR MINT</GlowButton>
              <button onClick={handleCancel}
                className="text-[#39ff14]/30 text-xs tracking-widest hover:text-[#39ff14]/60 transition-colors cursor-pointer">
                ✕ cancelar
              </button>
              {txErrorMessage && (
                <p className="text-red-400/80 text-xs tracking-wider text-center">{txErrorMessage}</p>
              )}
            </div>

          /* CONFIRMING / MINTING */
          ) : stage === 'confirming' || stage === 'minting' ? (
            <div className="flex flex-col items-center gap-4 w-full">
              {imageDataUri && (
                <div className="w-full aspect-square border border-[#39ff14]/20 overflow-hidden opacity-70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageDataUri} alt="NFT sendo mintado" className="w-full h-full object-cover" />
                </div>
              )}
              <GlowButton disabled>
                {stage === 'confirming' ? '◌  CONFIRME NA CARTEIRA...' : '◌  MINTANDO...'}
              </GlowButton>
            </div>

          /* IDLE — default mint button */
          ) : (
            <>
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
              <GlowButton onClick={handleMintClick}>⬡  MINT DEFIDEV</GlowButton>
              {generateError && (
                <p className="text-red-400/80 text-xs tracking-wider text-center">{generateError}</p>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
