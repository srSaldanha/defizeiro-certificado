'use client'

import { useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CONTRACT_ADDRESS, ABI } from '@/lib/contract'

export function MintSection() {
  const { address, isConnected } = useAccount()

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

  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  useEffect(() => {
    if (isSuccess) {
      refetchSupply()
      refetchMinted()
    }
  }, [isSuccess, refetchSupply, refetchMinted])

  const handleMint = () => {
    reset()
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'mint',
    })
  }

  const supply = totalSupply !== undefined ? Number(totalSupply) : null
  const progress = supply !== null ? (supply / 1000) * 100 : 0

  const errorMessage = (() => {
    if (!error) return null
    const msg = error.message
    if (msg.includes('User rejected') || msg.includes('user rejected')) return 'Transaction cancelled.'
    if (msg.includes('Already minted')) return 'This wallet already minted.'
    if (msg.includes('Max supply')) return 'Max supply reached.'
    return 'Transaction failed. Try again.'
  })()

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Supply stats */}
      <div className="text-center mb-8">
        <div className="flex items-end justify-center gap-3">
          <span
            className="text-6xl font-bold text-[#39ff14]"
            style={{ textShadow: '0 0 10px #39ff14, 0 0 30px #39ff14' }}
          >
            {supply ?? '—'}
          </span>
          <span className="text-2xl text-[#39ff14]/40 mb-2 font-light">/ 1000</span>
        </div>
        <p className="text-[#39ff14]/40 text-xs tracking-[0.4em] mt-1">MINTED</p>
        <div className="mt-4 h-px bg-[#39ff14]/10 w-full overflow-hidden">
          <div
            className="h-full bg-[#39ff14] transition-all duration-1000"
            style={{ width: `${progress}%`, boxShadow: '0 0 8px #39ff14' }}
          />
        </div>
      </div>

      {/* Main card */}
      <div className="relative border border-[#39ff14]/20 p-8 bg-[#000d00]"
        style={{ boxShadow: '0 0 40px rgba(57,255,20,0.08), inset 0 0 40px rgba(57,255,20,0.03)' }}>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#39ff14]/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#39ff14]/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#39ff14]/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#39ff14]/60" />

        <div className="flex flex-col items-center gap-6">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="text-5xl text-[#39ff14] mb-4" style={{ animation: 'pulse 2s ease-in-out infinite' }}>✦</div>
              <p className="text-[#39ff14] tracking-[0.3em] font-bold text-lg">MINT SUCCESSFUL</p>
              <p className="text-[#39ff14]/50 text-xs tracking-widest mt-3">WELCOME TO THE DEFIVERSO</p>
            </div>
          ) : alreadyMinted ? (
            <div className="text-center py-4">
              <div className="text-4xl text-[#39ff14]/60 mb-4">◈</div>
              <p className="text-[#39ff14] tracking-[0.3em] font-bold">ALREADY CLAIMED</p>
              <p className="text-[#39ff14]/40 text-xs tracking-widest mt-3">THIS WALLET HAS MINTED A DEFIDEV</p>
            </div>
          ) : !isConnected ? (
            <>
              <p className="text-[#39ff14]/50 text-xs tracking-[0.35em] text-center">
                CONNECT YOUR WALLET TO MINT
              </p>
              <ConnectButton />
            </>
          ) : (
            <>
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
              <button
                onClick={handleMint}
                disabled={isPending || isConfirming}
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
                {isPending
                  ? '◌  CONFIRM IN WALLET...'
                  : isConfirming
                  ? '◌  MINTING...'
                  : '⬡  MINT DEFIDEV'}
              </button>
            </>
          )}

          {errorMessage && (
            <p className="text-red-400/80 text-xs tracking-wider text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}
