# Synapse Monorepo

Um monorepo moderno gerenciado por **Nx** com React/Vite para o frontend, NestJS para a API e tipos compartilhados em TypeScript.

## 🏗️ Estrutura do Projeto

```
synapse-monorepo/
├── packages/
│   ├── web/              # React + Vite (Frontend)
│   ├── api/              # NestJS (Backend API)
│   └── shared-types/     # Tipos TypeScript compartilhados
├── nx.json               # Configuração Nx
├── package.json          # Configuração do workspace
└── tsconfig.json         # Configuração TypeScript global
```

## 🚀 Como executar

### Pré-requisitos
- Node.js >= 18
- npm >= 9

### Instalação
```bash
# Instalar dependências de todos os packages
npm install
```

### Desenvolvimento
```bash
# Executar web e api simultaneamente
npm run dev

# Ou executar separadamente:
npm run dev:web    # Frontend na porta 3000
npm run dev:api    # Backend na porta 3001
```

### Build
```bash
# Build de todos os packages
npm run build

# Build individual
npm run build:web
npm run build:api
npm run build:shared-types

# Ou usando nx diretamente
nx build web
nx build api
```

### Comandos Nx Úteis

```bash
# Visualizar grafo de dependências
npm run graph

# Executar apenas o que foi afetado por mudanças
npm run affected:build
npm run affected:test

# Ver todos os projetos
nx show projects

# Limpar cache do Nx
nx reset
```

## 📦 Packages

### @synapse/web
- **Framework**: React 18 + Vite
- **Linguagem**: TypeScript
- **Porta**: 3000
- **Proxy**: `/api/*` → `http://localhost:3001`

### @synapse/api
- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Porta**: 3001
- **Prefix**: `/api`
- **CORS**: Habilitado para `http://localhost:3000`
- **Database**: Prisma + PostgreSQL

### @synapse/shared-types
- **Tipos compartilhados** entre web e api
- **Compilação**: TypeScript para CommonJS
- **Exporta**: Interfaces, DTOs, enums e constantes

## 🛠️ Scripts Disponíveis

### Root (Workspace)
- `npm run dev` - Executa web e api em desenvolvimento (paralelo)
- `npm run build` - Build de todos os packages (com cache Nx)
- `npm run test` - Testa todos os packages
- `npm run lint` - Lint de todos os packages
- `npm run lint:fix` - Fix automático de lint
- `npm run type-check` - Verificação de tipos
- `npm run clean` - Limpa cache, dist e node_modules
- `npm run graph` - Visualiza grafo de dependências

### Desenvolvimento Individual
- `npm run dev:web` - Apenas frontend
- `npm run dev:api` - Apenas backend
- `npm run build:web` - Build do frontend
- `npm run build:api` - Build do backend

### Database (Prisma)
- `npm run db:generate` - Gera Prisma Client
- `npm run db:push` - Push schema para o DB
- `npm run db:migrate` - Executa migrations
- `npm run db:studio` - Abre Prisma Studio

### Affected (Executar apenas o que mudou)
- `npm run affected` - Mostra projetos afetados
- `npm run affected:build` - Build apenas do que mudou
- `npm run affected:test` - Testa apenas o que mudou

## 🔧 Tecnologias

- **Monorepo Manager**: Nx
- **Frontend**: React, Vite, TypeScript
- **Backend**: NestJS, TypeScript, Prisma
- **Database**: PostgreSQL
- **Linting**: ESLint + Prettier
- **Types**: TypeScript com project references
- **Package Manager**: npm workspaces

## 🎯 Benefícios do Nx

- ✅ **Cache Inteligente**: Builds e testes mais rápidos
- ✅ **Affected Commands**: Execute apenas o que mudou
- ✅ **Grafo de Dependências**: Visualize relações entre projetos
- ✅ **Paralelização**: Execução paralela de tarefas
- ✅ **Generators**: Scaffolding automático de código
- ✅ **Melhor DX**: Ferramentas e plugins otimizados
- [ ] Docker para desenvolvimento
- [ ] Documentação da API (Swagger)

## 🤝 Contribuição

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Faça suas alterações
4. Execute os testes: `npm test`
5. Envie um pull request
