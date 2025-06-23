# Mouts TI - Desafio Full Stack

Este repositório contém a implementação de uma aplicação Full Stack para um teste técnico, utilizando Next.js para o frontend e NestJS para o backend.

## Descrição do Projeto

O objetivo do projeto é criar um CRUD (Create, Read, Update, Delete) completo de usuários.

A aplicação é composta por:

-   **Frontend:** Desenvolvido com **Next.js** e **React Query** para uma gestão de estado do servidor eficiente e otimizada.
-   **Backend:** Uma API RESTful construída com **NestJS**, responsável pela lógica de negócio e comunicação com o banco de dados.
-   **Banco de Dados:** Utiliza um banco de dados relacional (PostgreSQL/MySQL) com **TypeORM** ou **Prisma**.
-   **Cache:** Implementação de cache com **Redis** para otimizar as consultas de usuários.
-   **Testes:** Testes unitários e de integração com **Jest** em ambas as aplicações para garantir a qualidade e a robustez do código.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados em sua máquina:

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Instalação e Configuração

Siga os passos abaixo para configurar o ambiente de desenvolvimento localmente.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/mouts-ti-test.git
    cd mouts-ti-test
    ```

2.  **Configuração das Variáveis de Ambiente:**
    O projeto utiliza arquivos `.env` para gerenciar as variáveis de ambiente. Copie os arquivos de exemplo e, se necessário, ajuste as configurações.

    ```bash
    # Para o backend
    cp backend/.env.example backend/.env

    # Para o frontend
    cp frontend/.env.example frontend/.env
    ```

## Rodando o Projeto

Com o Docker e o Docker Compose instalados, você pode iniciar toda a aplicação com um único comando a partir da raiz do projeto.

```bash
docker-compose up -d --build
```

O comando acima irá construir as imagens e iniciar os contêineres para o frontend, backend, banco de dados e Redis.

Após a inicialização, os serviços estarão disponíveis nos seguintes endereços:

-   **Frontend (Next.js):** `http://localhost:3000`
-   **Backend (NestJS API):** `http://localhost:3001`

## Testes

Os testes unitários foram implementados com Jest para validar os casos de uso e a lógica de negócio. Para executar os testes, utilize os seguintes comandos:

-   **Rodar testes do Backend (NestJS):**
    ```bash
    docker-compose exec backend npm run test
    ```

-   **Rodar testes do Frontend (Next.js):**
    ```bash
    docker-compose exec frontend npm run test
    ```

## Estrutura do Projeto

O projeto está organizado em uma estrutura de monorepo, com diretórios separados para o frontend e o backend.

```
mouts-ti-test/
├── backend/                         # Aplicação principal com arquitetura hexagonal (NestJS)
│   ├── src/
│   │   ├── users/                   # Módulo de usuários (entidades, services, DTOs, repositórios)
│   │   ├── core/                    # Núcleo da aplicação (ports, use cases, regras de negócio)
│   │   ├── infra/                   # Adaptadores de saída (banco de dados, Redis, etc.)
│   │   ├── main.ts                 # Ponto de entrada da aplicação
│   │   └── app.module.ts          # Módulo raiz da aplicação NestJS
│   ├── test/                       # Testes automatizados (Jest)
│   ├── Dockerfile
│   └── package.json
├── frontend/                        # Interface web e BFF (Next.js)
│   ├── src/
│   │   ├── app/                    # Rotas e páginas da aplicação (Next.js App Router)
│   │   ├── api/                   # Rotas API (BFF) que intermediam chamadas ao backend
│   │   │   ├── users/             # Ex: `GET /api/users` chama o backend e adapta resposta
│   │   │   └── utils/             # Funções auxiliares (ex: adaptadores de payload)
│   │   ├── components/            # Componentes React reutilizáveis
│   │   ├── hooks/                 # Hooks customizados (React Query, etc.)
│   │   └── lib/                   # Clientes HTTP, configurações globais
│   ├── tests/                     # Testes automatizados do frontend (Jest)
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml              # Orquestração dos serviços (backend, frontend, banco e Redis)
└── README.md                       # Documentação do projeto
```
