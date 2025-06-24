# ---- Builder Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

# Copia os arquivos de lock e package.json da raiz e do workspace
COPY package.json yarn.lock ./
COPY frontend/package.json ./frontend/

# Instala todas as dependências do monorepo
RUN yarn install --frozen-lockfile

# Copia o código fonte do frontend
COPY frontend/ ./frontend/

# Executa o build do workspace 'frontend'
RUN yarn workspace frontend build

# ---- Production Stage ----
FROM node:22-alpine
WORKDIR /app

# Copia os artefatos da build e as dependências de produção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json
COPY --from=builder /app/frontend/next.config.ts ./next.config.ts
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next

EXPOSE 3000

# O script "start" deve ser "next start" no package.json do frontend
CMD ["yarn", "start"]