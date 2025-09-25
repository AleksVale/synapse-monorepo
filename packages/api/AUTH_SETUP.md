# NestJS Authentication with JWT and Passport

## ✅ Implementação Completa

A autenticação JWT com Passport foi implementada seguindo Clean Architecture e as melhores práticas do NestJS.

### 🏗️ Estrutura Implementada

```
src/
├── application/
│   └── services/
│       ├── auth.service.ts        # Lógica de negócio da autenticação
│       └── crypto.service.ts      # Serviço de hash/comparação de senhas
├── infrastructure/
│   └── auth/
│       ├── auth.module.ts         # Módulo de autenticação
│       ├── local.strategy.ts      # Estratégia para login com email/senha
│       ├── jwt.strategy.ts        # Estratégia para validação JWT Bearer token
│       ├── local-auth.guard.ts    # Guard para estratégia local
│       ├── jwt-auth.guard.ts      # Guard para estratégia JWT
│       └── current-user.decorator.ts # Decorator para acessar usuário atual
└── presentation/
    └── controllers/
        └── auth.controller.ts     # Endpoints de autenticação
```

## 🔧 Funcionalidades Implementadas

### **1. AuthService (Application Layer)**
- ✅ `validateUser()` - Validação de credenciais
- ✅ `login()` - Autenticação e geração de JWT
- ✅ `register()` - Registro de novos usuários
- ✅ `findUserById()` - Busca usuário por ID
- ✅ Hash de senhas com bcrypt (saltRounds: 12)

### **2. Estratégias Passport**
- ✅ **LocalStrategy** - Para login com email/senha
- ✅ **JwtStrategy** - Para validação de Bearer tokens
- ✅ Configuração automática do secret JWT

### **3. Guards de Segurança**
- ✅ **LocalAuthGuard** - Para endpoints de login
- ✅ **JwtAuthGuard** - Para endpoints protegidos
- ✅ **@CurrentUser** decorator - Acesso ao usuário autenticado

### **4. Endpoints da API**

#### `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### `POST /api/auth/register`
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

#### `GET /api/auth/profile` (Protegido)
**Headers:** `Authorization: Bearer <token>`

#### `GET /api/auth/me` (Protegido)
**Headers:** `Authorization: Bearer <token>`

## 🚀 Como Usar

### **1. Registrar um usuário:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **2. Fazer login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **3. Acessar perfil (com token):**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer <seu-token-aqui>"
```

## ⚙️ Configuração

### **Variáveis de Ambiente**
Crie um arquivo `.env` na pasta `packages/api/`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/synapse_db"
JWT_SECRET="your-super-secret-jwt-key-here"
```

### **Configuração JWT**
- **Expiração:** 24 horas
- **Algoritmo:** HS256
- **Secret:** Configurável via environment variable

## 🔒 Segurança Implementada

- ✅ **Hash de senhas** com bcrypt (12 salt rounds)
- ✅ **JWT tokens** com expiração configurável
- ✅ **Bearer token validation** em endpoints protegidos
- ✅ **Guards automáticos** do NestJS
- ✅ **TypeScript type safety** em toda aplicação
- ✅ **Separação de responsabilidades** (Clean Architecture)

## 🏛️ Clean Architecture

A implementação segue os princípios de Clean Architecture:

- **Domain Layer:** Interfaces e contratos (`IUserRepository`)
- **Application Layer:** Casos de uso (`AuthService`, `CryptoService`)
- **Infrastructure Layer:** Implementações (`Strategies`, `Guards`, `AuthModule`)
- **Presentation Layer:** Controllers e DTOs

## 📋 Próximos Passos

1. **Refresh Tokens** - Implementar renovação automática
2. **Rate Limiting** - Proteger endpoints contra brute force
3. **Email Verification** - Verificação de email no registro
4. **Password Reset** - Funcionalidade de recuperação de senha
5. **Roles & Permissions** - Sistema de autorização baseado em roles
6. **Session Management** - Controle de sessões ativas
7. **Social Login** - Integração com Google, GitHub, etc.

## ✅ Status da Implementação

- ✅ Dependências instaladas
- ✅ AuthModule configurado
- ✅ Estratégias Passport implementadas
- ✅ AuthService com casos de uso
- ✅ Controllers com endpoints
- ✅ Guards e decorators
- ✅ Integração no AppModule
- ✅ Tipos TypeScript corretos

**A autenticação JWT está totalmente funcional e pronta para uso!** 🎉