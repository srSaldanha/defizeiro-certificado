import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const NFT_PROMPT = `Crie uma arte NFT de um personagem alienígena da Coleção Defiverso Cripto, inspirado em ETs clássicos de cabeça grande, olhos enormes e aparência estranha, divertida e colecionável. O alien deve ter estilo anime/cartoon moderno, traços marcados, cores vibrantes, contraste alto e visual simples de reconhecer. O personagem deve parecer uma espécie alienígena única, não humana, com cabeça desproporcional, corpo pequeno, olhos grandes e expressivos, boca engraçada ou bizarra, dentes pequenos, pele colorida e detalhes orgânicos diferentes. Ele pode ter antenas, manchas, cicatrizes alienígenas, orelhas finas, crânio alongado, veias brilhantes, dedos finos ou expressão exagerada. O tema principal deve ser criptomoedas, blockchain e universo Web3, mas de forma divertida e visual. O alien pode estar segurando moedas digitais brilhantes, tokens, gráficos de alta, símbolos abstratos de blockchain, cubos flutuantes, carteiras cripto, hologramas simples, NFTs, chaves digitais, correntes de blocos, satélites em forma de moeda ou um pequeno disco voador decorado com ícones de cripto. A imagem deve transmitir a ideia de um personagem mascote de um curso sobre criptomoedas: divertido, curioso, inteligente, amigável e com energia de descoberta financeira. O alien deve parecer um explorador do universo cripto, como se estivesse viajando pelo espaço para aprender sobre Bitcoin, blockchain, DeFi, NFTs e tokens, mas sem usar logotipos reais de moedas ou marcas conhecidas. O fundo deve ser chamativo e simples, com espaço cósmico estilizado, estrelas, planetas, luas, gráficos luminosos, velas de candle, formas geométricas, blocos conectados e moedas flutuantes. A composição deve ser quadrada, ideal para NFT, com o personagem centralizado, corpo ou busto bem visível, pose forte e memorável, aparência de avatar colecionável, acabamento limpo, linhas expressivas, iluminação neon, sombras dramáticas, cores fortes como verde alienígena, roxo, azul, amarelo, laranja, rosa e ciano. Varie sempre a espécie, formato da cabeça, olhos, boca, cor da pele, expressão e acessórios cripto. Arte digital premium, anime cartoon, NFT avatar, personagem icônico, mascote colecionável, alta qualidade.`

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const response = await openai.images.generate({
    model: 'gpt-image-1',
    prompt: NFT_PROMPT,
    n: 1,
    size: '1024x1024',
  })

  const imageData = response.data?.[0]
  if (!imageData) {
    return NextResponse.json({ error: 'No image returned' }, { status: 500 })
  }

  if (imageData.b64_json) {
    return NextResponse.json({ b64: imageData.b64_json })
  }

  if (imageData.url) {
    return NextResponse.json({ url: imageData.url })
  }

  return NextResponse.json({ error: 'No image data in response' }, { status: 500 })
}
