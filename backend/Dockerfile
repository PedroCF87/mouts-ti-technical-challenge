# Dockerfile for NestJS Backend
# ---- Builder Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

# Copia os arquivos de lock e package.json da raiz e do workspace
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/

# Instala todas as dependências do monorepo
RUN yarn install --frozen-lockfile

# Copia o código fonte do backend
COPY backend/ ./backend/

# Executa o build do workspace 'backend'
RUN yarn workspace backend build

# ---- Production Stage ----
FROM node:22-alpine
WORKDIR /app

# Copia os artefatos da build e as dependências de produção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json
COPY --from=builder /app/backend/dist ./dist

EXPOSE 3001

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/main"]
