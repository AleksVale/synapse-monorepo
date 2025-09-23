# Synapse Monorepo

Um monorepo moderno com React/Vite para o frontend, NestJS para a API e tipos compartilhados em TypeScript.

## 🏗️ Estrutura do Projeto

```
synapse-monorepo/
├── packages/
│   ├── web/              # React + Vite (Frontend)
│   ├── api/              # NestJS (Backend API)
│   └── shared-types/     # Tipos TypeScript compartilhados
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
npm run install:all

# Ou simplesmente
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
npm run build -w @synapse/web
npm run build -w @synapse/api
npm run build -w @synapse/shared-types
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

### @synapse/shared-types
- **Tipos compartilhados** entre web e api
- **Compilação**: TypeScript para CommonJS
- **Exporta**: Interfaces, DTOs, enums e constantes

## 🛠️ Scripts Disponíveis

### Root (Workspace)
- `npm run dev` - Executa web e api em desenvolvimento
- `npm run build` - Build de todos os packages
- `npm run lint` - Lint de todos os packages
- `npm run lint:fix` - Fix automático de lint
- `npm run clean` - Limpa node_modules e builds
- `npm run type-check` - Verificação de tipos

### Desenvolvimento Individual
- `npm run dev:web` - Apenas frontend
- `npm run dev:api` - Apenas backend

## 🔧 Tecnologias

- **Frontend**: React, Vite, TypeScript
- **Backend**: NestJS, TypeScript
- **Monorepo**: npm workspaces
- **Linting**: ESLint + Prettier
- **Types**: TypeScript com project references

## 📝 Próximos Passos

- [ ] Configurar banco de dados (TypeORM + SQLite)
- [ ] Implementar autenticação JWT
- [ ] Adicionar testes (Jest + Testing Library)
- [ ] Setup de CI/CD
- [ ] Docker para desenvolvimento
- [ ] Documentação da API (Swagger)

## 🤝 Contribuição

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Faça suas alterações
4. Execute os testes: `npm test`
5. Envie um pull request
