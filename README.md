# Mouts TI - Desafio Full Stack

Este repositório contém a implementação de uma aplicação Full Stack para um teste técnico, utilizando **TypeScript** em todo o stack (frontend e backend), com foco em qualidade, arquitetura e boas práticas de desenvolvimento.

## Descrição do Projeto

O objetivo do projeto é criar um CRUD (Create, Read, Update, Delete) completo de usuários, aplicando **TDD (Test-Driven Development)** desde o início do desenvolvimento.

A aplicação é composta por:

-   **Frontend:** Desenvolvido com **Next.js** (em TypeScript) e **React Query** para uma gestão eficiente do estado do servidor. O frontend consome a API do backend e segue boas práticas de componentização e testes automatizados.
-   **Backend:** API RESTful construída com **NestJS** (em TypeScript), estruturada segundo a **Arquitetura Hexagonal (Ports & Adapters)**, promovendo separação de responsabilidades, testabilidade e flexibilidade. O backend implementa TDD com testes unitários e de integração desde o início.
-   **Banco de Dados:** Utiliza **PostgreSQL** (padrão) com **TypeORM** para mapeamento objeto-relacional.
-   **Cache:** Implementação de cache com **Redis** para otimizar consultas de usuários.
-   **Testes:** Testes unitários e de integração com **Jest** em ambas as aplicações, seguindo o ciclo TDD para garantir qualidade e robustez do código.

## Abordagem de Desenvolvimento

- **TypeScript em todo o projeto:** Garantindo tipagem estática, segurança e melhor manutenção do código.
- **TDD (Test-Driven Development):** O desenvolvimento de novas funcionalidades é guiado por testes, promovendo código confiável e fácil de evoluir.
- **Arquitetura Hexagonal no Backend:** O backend é organizado em camadas (core, application, domain, infra/adapters), facilitando testes, manutenção e evolução.

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
docker compose up -d --build
```

O comando acima irá construir as imagens e iniciar os contêineres para o frontend, backend, banco de dados e Redis.

Após a inicialização, os serviços estarão disponíveis nos seguintes endereços:

-   **Frontend (Next.js):** `http://localhost:3000`
-   **Backend (NestJS API):** `http://localhost:3001`

## Acesso à Aplicação

A tela de listagem de usuários é protegida e requer autenticação. Para acessar, utilize os seguintes dados de login:

```json
{
    "email": "user@example.com",
    "password": "user123"
}
```

Esses dados são inseridos no banco de dados através de uma *migration* durante a inicialização do backend, garantindo que um usuário de teste esteja sempre disponível.

## Coleção Postman

Para facilitar o teste manual da API, uma coleção do Postman está disponível na raiz do projeto. Você pode importá-la diretamente no Postman utilizando o arquivo [`postman_collection.json`](./postman_collection.json).

---

## Como Executar os Testes

Para rodar todos os testes automatizados do backend, execute o comando abaixo a partir da raiz do projeto:

```bash
yarn test:backend
```

Esse comando irá rodar todos os testes unitários e de integração do backend utilizando o Jest, exibindo o resultado detalhado (verbose) de cada teste.

> **Dica:**
> - Certifique-se de que as dependências estejam instaladas (`yarn install`) antes de rodar os testes.
> - O comando pode ser executado tanto em ambiente local quanto dentro do container Docker (usando `docker compose exec backend yarn test:backend`).

## Integração Contínua (CI)

> **Pipeline automatizado com GitHub Actions**

Este projeto conta com um pipeline de Integração Contínua (CI) implementado via **GitHub Actions**. A cada push ou pull request, o pipeline é executado automaticamente, instalando as dependências e rodando todos os testes do backend para garantir a qualidade do código e evitar regressões.

- O workflow está localizado em [`.github/workflows/unit-tests.yml`](.github/workflows/unit-tests.yml).
- Todos os testes do backend são executados automaticamente a cada commit e pull request.
- O status do pipeline pode ser acompanhado [diretamente no GitHub](https://github.com/PedroCF87/mouts-ti-technical-challenge/actions/workflows/unit-tests.yml).

Isso garante que a base de código permaneça confiável e que todas as contribuições sejam devidamente testadas antes de serem integradas.

![https://raw.githubusercontent.com/PedroCF87/mouts-ti-technical-challenge/main/test-pipeline.png](test-pipeline)

---

## Estrutura do Projeto

O projeto está organizado em uma estrutura de monorepo, com diretórios separados para frontend e backend, ambos em TypeScript. O backend segue a arquitetura hexagonal.

```
mouts-ti-test/
├── backend/
├── src/
│   ├── core/                    # Núcleo da aplicação
│   │   ├── domain/             # Entidades e interfaces do domínio
│   │   │   └── user.repository.ts
│   │   └── use-cases/          # Casos de uso/serviços
│   │       ├── user.service.ts
│   │       └── auth.service.ts
│   ├── adapters/               # Adaptadores
│   │   ├── controllers/        # Controladores HTTP
│   │   │   ├── user.controller.ts
│   │   │   └── auth.controller.ts
│   │   └── repositories/       # Implementações de repositórios
│   │       └── user.repository.ts
│   ├── infra/                  # Infraestrutura
│   │   ├── db/
│   │   │   └── entities/       # Entidades do TypeORM
│   │   │       └── user.entity.ts
│   │   └── modules/            # Módulos do NestJS
│   │       ├── user.module.ts
│   │       └── auth.module.ts
│   ├── database/               # Configuração do banco e migrations
│   │   ├── migrations/
│   │   └── data-source.ts
│   ├── main.ts
│   │── auth.module.ts
│   └── app.module.ts
├── frontend/                        # Frontend (Next.js, TypeScript)
│   ├── src/
│   │   ├── app/                     # Rotas e páginas da aplicação (Next.js App Router)
│   │   ├── api/                     # Rotas API (BFF) que intermediam chamadas ao backend
│   │   ├── components/              # Componentes React reutilizáveis
│   │   ├── hooks/                   # Hooks customizados (React Query, etc.)
│   │   └── lib/                     # Clientes HTTP, configurações globais
│   ├── tests/                       # Testes automatizados do frontend (Jest, TDD)
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── docker-compose.yml               # Orquestração dos serviços (backend, frontend, banco e Redis)
└── README.md                        # Documentação do projeto
```

> **Observação:**
> - O backend está organizado em `core` (domínio, casos de uso, portas), `adapters` (controllers, gateways, repositórios) e `infra` (implementações externas), seguindo a arquitetura hexagonal.
> - O frontend utiliza Next.js com TypeScript e React Query, com testes automatizados e estrutura modular.
> - O ciclo de desenvolvimento é guiado por TDD, com cobertura de testes desde o início.

---

Sinta-se à vontade para contribuir, sugerir melhorias ou tirar dúvidas!
