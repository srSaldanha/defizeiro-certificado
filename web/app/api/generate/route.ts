import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickMany<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function buildPrompt(): string {
  const skinColor = pick([
    'verde neon brilhante', 'roxo profundo com veias luminosas', 'azul metálico iridescente',
    'laranja vibrante com manchas escuras', 'cinza prateado com reflexos dourados',
    'rosa choque translúcido', 'amarelo tóxico com listras pretas',
    'turquesa com padrões de escamas', 'vermelho coral com bioluminescência',
    'branco gelo com veias violeta', 'marrom cósmico com manchas douradas',
  ])

  const headShape = pick([
    'crânio alongado e estreito', 'cabeça redonda e enorme como balão',
    'cabeça triangular com topo pontudo', 'crânio achatado com corcova atrás',
    'cabeça em formato de gota invertida', 'crânio com protuberâncias ósseas',
    'cabeça quadrada com cantos arredondados', 'crânio em espiral com cavidades',
    'cabeça em formato de cogumelo', 'crânio duplo com divisão central',
  ])

  const eyes = pick([
    'três olhos enormes dispostos em triângulo', 'olhos de inseto compostos multifacetados',
    'um único olho ciclope gigante e expressivo', 'quatro olhos pequenos em duas fileiras',
    'olhos que emitem raios de luz neon', 'olhos totalmente pretos sem pupila',
    'olhos em formato de X com íris giratória', 'olhos saltados e transparentes com circuitos internos',
    'olhos de cobra verticais com luz pulsante', 'olhos que parecem telas de holograma',
  ])

  const mouth = pick([
    'boca larga com dentes tortos coloridos', 'boca em formato de W com língua bifurcada',
    'bico metálico como robô', 'sorriso de orelha a orelha com dentes de neon',
    'boca circular cheia de dentes giratórios', 'maxilar duplo como xenomorfo estilizado',
    'nenhuma boca visível, apenas uma linha fina', 'boca rasgada com luz saindo de dentro',
    'focinho curto com narinas abertas', 'boca com zíper metálico dourado entreaberto',
  ])

  const extras = pickMany([
    'antenas longas com esferas brilhantes na ponta',
    'chifres pequenos de cristal translúcido',
    'orelhas pontiagudas com piercings de circuito',
    'veias bioluminescentes visíveis na pele',
    'cicatrizes alienígenas em padrão geométrico',
    'tentáculos pequenos saindo do queixo',
    'crista de espinhos ao longo da cabeça',
    'olheiras fundas com sombra escura dramática',
    'marcas tribais alienígenas gravadas na pele',
    'cabelo feito de fios de energia elétrica',
  ], 2)

  const cryptoItem = pick([
    'segurando uma moeda digital gigante que brilha como sol',
    'surfando em cima de um gráfico de alta neon',
    'carregando uma carteira cripto holográfica',
    'pilotando um disco voador decorado com símbolos de blockchain',
    'com correntes de blocos flutuando ao redor do corpo',
    'segurando uma chave digital dourada',
    'cercado por cubos de dados flutuantes',
    'com um NFT emoldurado flutuando ao lado',
    'lançando tokens brilhantes pelo ar',
    'conectado a uma rede de nós blockchain por fios de luz',
    'dentro de uma bolha de holograma DeFi',
    'usando óculos de realidade aumentada com gráficos cripto',
  ])

  const pose = pick([
    'pose de herói com braço erguido', 'sentado em posição de meditação cripto',
    'dançando com energia elétrica ao redor', 'apontando para o observador',
    'cruzando os braços com expressão de superioridade', 'pulando em celebração',
    'inclinado para frente curioso e investigativo', 'pose de surfista relaxado',
    'em posição de batalha pronto para lutar', 'flutuando no espaço em posição de yoga',
  ])

  const background = pick([
    'nebulosa roxa e azul com estrelas douradas e gráficos de candle neon',
    'espaço negro profundo com blocos de blockchain conectados por fios de luz',
    'planeta alienígena com superfície de circuito eletrônico e luas de moeda',
    'galáxia espiral com moedas flutuantes e hologramas DeFi',
    'vórtice cósmico verde e amarelo com dados digitais em cascata',
    'espaço com grade de matrix brilhante e constelações de token',
    'fundo de cidade futurista alienígena com arranha-céus de cristal',
    'campo de asteroides feitos de cubos de blockchain dourados',
    'portal dimensional com luz branca intensa e tokens ao redor',
    'aurora boreal neon sobre superfície de planeta gelado com ícones cripto',
  ])

  const style = pick([
    'estilo anime japonês com linhas grossas e cores saturadas',
    'estilo cartoon americano bold com sombras fortes',
    'estilo chibi fofo com proporções exageradas',
    'estilo cyberpunk com detalhes metálicos e neon',
    'estilo pop art com cores chapadas e contornos pretos',
    'estilo graffiti urbano com texturas de spray',
    'estilo flat design moderno com gradientes vibrantes',
  ])

  return `Arte NFT quadrada da coleção Defiverso Cripto. Personagem: alien ${skinColor}, com ${headShape}, ${eyes}, ${mouth}, ${extras.join(' e ')}. ${cryptoItem}. ${pose}. Fundo: ${background}. ${style}. Sem logotipos reais de marcas. Composição centralizada, avatar colecionável, iluminação neon, sombras dramáticas, ultra detalhado, 4K, alta qualidade.`
}

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const prompt = buildPrompt()

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
    return NextResponse.json({ b64: imageData.b64_json })
  }

  if (imageData.url) {
    return NextResponse.json({ url: imageData.url })
  }

  return NextResponse.json({ error: 'No image data in response' }, { status: 500 })
}
