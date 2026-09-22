# DevShowcase API

API REST da plataforma de portfólio de desenvolvedores, implementada em **Node.js + Express + TypeScript + Prisma + SQLite**. O banco relacional modela `Profile`, `Project`, `Technology`, `Feedback` e a tabela associativa `ProjectTechnology`.

## Requisitos

- Node.js 20+
- npm 10+
- VS Code (recomendado)

## Executar no VS Code

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

A API ficará disponível em `http://localhost:3333`. Para validar a instalação, acesse `GET /health`.

## Testes automatizados

```bash
npm test
```

## Endpoints

| Método | Rota | Finalidade |
|---|---|---|
| POST | `/api/profiles` | Cadastrar perfil |
| GET | `/api/profiles/:id` | Buscar perfil por ID, incluindo projetos |
| POST | `/api/technologies` | Cadastrar tecnologia |
| GET | `/api/technologies` | Listar tecnologias |
| POST | `/api/projects` | Cadastrar projeto e associar tecnologias |
| GET | `/api/projects` | Listar projetos com perfil, tecnologias e feedbacks |

### Exemplos de payload

Perfil:
```json
{"name":"Maria Silva","email":"maria@example.com","bio":"Desenvolvedora full-stack","avatarUrl":"https://example.com/avatar.png"}
```

Tecnologia:
```json
{"name":"Node.js","category":"Runtime"}
```

Projeto:
```json
{"title":"DevShowcase","description":"Plataforma para exibir projetos de desenvolvedores","repositoryUrl":"https://github.com/exemplo/devshowcase","deployUrl":"https://devshowcase.example.com","profileId":1,"technologyIds":[1]}
```

## Modelagem

- `Profile 1:N Project`: um perfil possui vários projetos.
- `Project N:N Technology`: projetos e tecnologias se relacionam pela tabela `ProjectTechnology`.
- `Project 1:N Feedback`: um projeto pode receber várias opiniões.

A entidade `Feedback` já está persistida e relacionada para as próximas etapas; o escopo desta entrega implementa os endpoints básicos especificados.

## Estrutura

```text
src/
  controllers/   regras dos endpoints
  lib/            cliente Prisma
  middlewares/   tratamento de erros e validação
  routes/        rotas REST
  schemas/       DTOs de entrada com Zod
  app.ts         configuração do Express
  server.ts      inicialização do servidor
prisma/schema.prisma
 tests/api.test.ts
```

## Demonstração sugerida no Postman

1. Executar `npm run dev`.
2. Criar um perfil e guardar o `id` retornado.
3. Criar uma tecnologia e guardar o `id` retornado.
4. Criar um projeto usando `profileId` e `technologyIds`.
5. Executar os GETs de perfil, tecnologias e projetos.
6. Demonstrar também uma requisição inválida para evidenciar a validação HTTP 400.

## Entrega

O PDF `ENTREGA_DEVSHOWCASE.pdf` contém os links exigidos e o roteiro de apresentação. O vídeo deve ser gravado pelo aluno, publicado no YouTube como **não listado**, e o link deve ser substituído no PDF antes do envio final.
