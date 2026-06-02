import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const NFT_PROMPT = `Crie uma arte NFT de um personagem alienígena da Coleção Defiverso Cripto, inspirado em ETs clássicos de cabeça grande, olhos enormes e aparência estranha, divertida e colecionável. O alien deve ter estilo anime/cartoon moderno, traços marcados, cores vibrantes, contraste alto e visual simples de reconhecer. O personagem deve parecer uma espécie alienígena única, não humana, com cabeça desproporcional, corpo pequeno, olhos grandes e expressivos, boca engraçada ou bizarra, dentes pequenos, pele colorida e detalhes orgânicos diferentes. Ele pode ter antenas, manchas, cicatrizes alienígenas, orelhas finas, crânio alongado, veias brilhantes, dedos finos ou expressão exagerada. O tema principal deve ser criptomoedas, blockchain e universo Web3, mas de forma divertida e visual. O alien pode estar segurando moedas digitais brilhantes, tokens, gráficos de alta, símbolos abstratos de blockchain, cubos flutuantes, carteiras cripto, hologramas simples, NFTs, chaves digitais, correntes de blocos, satélites em forma de moeda ou um pequeno disco voador decorado com ícones de cripto. A imagem deve transmitir a ideia de um personagem mascote de um curso sobre criptomoedas: divertido, curioso, inteligente, amigável e com energia de descoberta financeira. O alien deve parecer um explorador do universo cripto, como se estivesse viajando pelo espaço para aprender sobre Bitcoin, blockchain, DeFi, NFTs e tokens, mas sem usar logotipos reais de moedas ou marcas conhecidas. O fundo deve ser chamativo e simples, com espaço cósmico estilizado, estrelas, planetas, luas, gráficos luminosos, velas de candle, formas geométricas, blocos conectados e moedas flutuantes. O cenário deve lembrar o universo cripto misturado com espaço alienígena, sem ficar poluído demais. A composição deve ser quadrada, ideal para NFT, com o personagem centralizado, corpo ou busto bem visível, pose forte e memorável, aparência de avatar colecionável, acabamento limpo, linhas expressivas, iluminação neon, sombras dramáticas, cores fortes como verde alienígena, roxo, azul, amarelo, laranja, rosa e ciano. Cada geração deve criar um alien completamente diferente, como uma nova peça da Coleção Defiverso Cripto. Varie sempre a espécie, formato da cabeça, olhos, boca, dentes, cor da pele, expressão, acessórios cripto, moedas, fundo, pose, estilo do disco voador e personalidade. Nenhum alien deve parecer igual ao anterior. A coleção deve parecer diversa, divertida, rara e feita para representar diferentes personagens do universo cripto. Arte digital premium, anime cartoon, NFT avatar, personagem icônico, mascote colecionável, estilo divertido, alien clássico, cripto, blockchain, DeFi, Web3, tokens, moedas digitais, alta qualidade, ultra detalhado, 4K.`

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: NFT_PROMPT,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  })

  const url = response.data?.[0]?.url
  if (!url) {
    return NextResponse.json({ error: 'No image returned' }, { status: 500 })
  }

  return NextResponse.json({ url })
}
