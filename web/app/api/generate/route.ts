import { NextResponse } from 'next/server'
import OpenAI from 'openai'

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

  if (imageData.b64_json) {
    return NextResponse.json({ b64: imageData.b64_json, traits })
  }

  if (imageData.url) {
    return NextResponse.json({ url: imageData.url, traits })
  }

  return NextResponse.json({ error: 'No image data in response' }, { status: 500 })
}
