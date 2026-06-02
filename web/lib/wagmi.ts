import { createConfig, http } from 'wagmi'
import { gnosisChiado } from 'viem/chains'

export const config = createConfig({
  chains: [gnosisChiado],
  transports: {
    [gnosisChiado.id]: http('https://gnosis-chiado.g.alchemy.com/v2/2GkY9GTTjN6eokgVeGhHA'),
  },
  ssr: true,
})
