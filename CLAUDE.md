# defizeiro-certificado

Monorepo com dois módulos principais:

## contracts/ — Smart Contracts (Foundry)
- Solidity ^0.8.24
- `src/` → contratos principais
- `test/` → testes com `forge test`
- `script/` → scripts de deploy com `forge script`
- Instalar: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- Instalar dependências: `forge install foundry-rs/forge-std`
- Rodar testes: `forge test`

## web/ — Frontend (Next.js 15 + TypeScript + Tailwind v4)
- App Router (`app/`)
- Instalar Node.js via nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && nvm install --lts`
- Instalar deps: `cd web && npm install`
- Rodar em dev: `npm run dev`
