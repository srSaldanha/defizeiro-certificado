import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { cloudinary } from '@/lib/cloudinary'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export type NFTTraits = {
  Pele: string
  Crânio: string
  Olhos: string
  Boca: string
  Extras: string[]
  'Item Cripto': string
  Pose: string
  Cenário: string
  Estilo: string
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickMany<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

function buildTraits(): NFTTraits {
  return {
    Pele: pick([
      'Verde Neon', 'Roxo Profundo', 'Azul Metálico', 'Laranja Vibrante',
      'Cinza Prateado', 'Rosa Choque', 'Amarelo Tóxico', 'Turquesa Escamado',
      'Vermelho Coral Bioluminescente', 'Branco Gelo', 'Marrom Cósmico',
    ]),
    Crânio: pick([
      'Alongado e Estreito', 'Enorme Redondo', 'Triangular Pontudo',
      'Achatado com Corcova', 'Gota Invertida', 'Protuberâncias Ósseas',
      'Quadrado Arredondado', 'Espiral com Cavidades', 'Formato Cogumelo', 'Duplo Dividido',
    ]),
    Olhos: pick([
      'Três Olhos em Triângulo', 'Olho de Inseto Composto', 'Ciclope Gigante',
      'Quatro Olhos em Fileiras', 'Emite Raios Neon', 'Totalmente Negros',
      'Formato de X com Íris Giratória', 'Saltados Transparentes com Circuitos',
      'Cobra Vertical Pulsante', 'Telas de Holograma',
    ]),
    Boca: pick([
      'Dentes Tortos Coloridos', 'Formato W com Língua Bifurcada', 'Bico Metálico',
      'Sorriso Neon de Orelha a Orelha', 'Circular com Dentes Giratórios',
      'Maxilar Duplo Estilizado', 'Linha Fina Sem Boca', 'Rasgada com Luz Interior',
      'Focinho com Narinas Abertas', 'Zíper Metálico Dourado',
    ]),
    Extras: pickMany([
      'Antenas com Esferas Neon', 'Chifres de Cristal', 'Orelhas Pontiagudas com Circuito',
      'Veias Bioluminescentes', 'Cicatrizes Geométricas', 'Tentáculos no Queixo',
      'Crista de Espinhos', 'Olheiras Dramáticas', 'Marcas Tribais Alienígenas',
      'Cabelo de Energia Elétrica',
    ], 2),
    'Item Cripto': pick([
      'Moeda Digital Gigante Brilhante', 'Surfando em Gráfico de Alta Neon',
      'Carteira Cripto Holográfica', 'Disco Voador com Blockchain',
      'Correntes de Blocos Flutuantes', 'Chave Digital Dourada',
      'Cubos de Dados Flutuantes', 'NFT Emoldurado ao Lado',
      'Lançando Tokens pelo Ar', 'Conectado a Rede de Nós por Luz',
      'Bolha de Holograma DeFi', 'Óculos de Realidade Aumentada Cripto',
    ]),
    Pose: pick([
      'Herói com Braço Erguido', 'Meditação Cripto', 'Dançando com Energia Elétrica',
      'Apontando para o Observador', 'Braços Cruzados Dominante',
      'Pulando em Celebração', 'Curioso e Investigativo',
      'Surfista Relaxado', 'Batalha Pronto', 'Yoga no Espaço',
    ]),
    Cenário: pick([
      'Nebulosa Roxa com Candles Neon', 'Blocos de Blockchain Conectados',
      'Planeta de Circuito Eletrônico', 'Galáxia com Hologramas DeFi',
      'Vórtice Cósmico Verde', 'Matrix Brilhante com Tokens',
      'Cidade Futurista Alienígena', 'Asteroides de Blockchain Dourado',
      'Portal Dimensional', 'Aurora Boreal Cripto',
    ]),
    Estilo: pick([
      'Anime Japonês', 'Cartoon Bold', 'Chibi Fofo',
      'Cyberpunk Metálico', 'Pop Art', 'Graffiti Urbano', 'Flat Design Vibrante',
    ]),
  }
}

function traitsToPrompt(t: NFTTraits): string {
  return `Arte NFT quadrada da coleção Defiverso Cripto. Personagem: alien com pele ${t.Pele}, crânio ${t.Crânio}, ${t.Olhos}, boca ${t.Boca}, com ${t.Extras.join(' e ')}. ${t['Item Cripto']}. Pose: ${t.Pose}. Fundo: ${t.Cenário}. Estilo: ${t.Estilo}. Sem logotipos reais de marcas. Composição centralizada, avatar colecionável, iluminação neon, sombras dramáticas, ultra detalhado, 4K.`
}

async function uploadToCloudinary(b64: string, traits: NFTTraits) {
  const tokenId = `defiverso-${Date.now()}`

  // 1. Upload image
  const imageUpload = await cloudinary.uploader.upload(
    `data:image/png;base64,${b64}`,
    { folder: 'defiverso/images', public_id: tokenId, resource_type: 'image' }
  )

  // 2. Build ERC-721 metadata JSON
  const metadata = {
    name: `DefiversoPortalDoDev — ${tokenId}`,
    description: 'Alien cripto da Coleção Defiverso. Explorador do universo Web3, blockchain e DeFi.',
    image: imageUpload.secure_url,
    external_url: 'https://github.com/srSaldanha/defizeiro-certificado',
    attributes: [
      { trait_type: 'Pele',        value: traits.Pele },
      { trait_type: 'Crânio',      value: traits.Crânio },
      { trait_type: 'Olhos',       value: traits.Olhos },
      { trait_type: 'Boca',        value: traits.Boca },
      { trait_type: 'Extra 1',     value: traits.Extras[0] },
      { trait_type: 'Extra 2',     value: traits.Extras[1] },
      { trait_type: 'Item Cripto', value: traits['Item Cripto'] },
      { trait_type: 'Pose',        value: traits.Pose },
      { trait_type: 'Cenário',     value: traits.Cenário },
      { trait_type: 'Estilo',      value: traits.Estilo },
    ],
  }

  // 3. Upload metadata JSON as raw file
  const metaUpload = await cloudinary.uploader.upload(
    `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`,
    { folder: 'defiverso/metadata', public_id: tokenId, resource_type: 'raw', format: 'json' }
  )

  return {
    imageUrl: imageUpload.secure_url,
    metadataUrl: metaUpload.secure_url,
    tokenId,
  }
}

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const traits = buildTraits()
  const prompt = traitsToPrompt(traits)

  const response = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1024x1024',
  })

  const imageData = response.data?.[0]
  if (!imageData) {
    return NextResponse.json({ error: 'No image returned' }, { status: 500 })
  }

  const b64 = imageData.b64_json
  if (!b64) {
    return NextResponse.json({ error: 'No image data in response' }, { status: 500 })
  }

  const { imageUrl, metadataUrl, tokenId } = await uploadToCloudinary(b64, traits)

  return NextResponse.json({ imageUrl, metadataUrl, tokenId, traits })
}
