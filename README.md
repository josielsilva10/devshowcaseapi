# DevShowcase API

API REST de portfólios de desenvolvedores construída com **Node.js, Express 5, TypeScript, Prisma 6 e SQLite/PostgreSQL**. Este repositório mantém SQLite para o desenvolvimento local já usado pelo grupo e inclui schema/migrações PostgreSQL para o deploy.

## Requisitos e execução local

- Node.js 20 ou superior e npm.

```bash
copy .env.example .env
npm ci
npm run db:setup
npm run dev
```

A API local fica em `http://localhost:3333`. No PowerShell, `copy` cria o `.env` usando o modelo fornecido; em Linux/macOS, use `cp .env.example .env`. O comando `db:setup` gera o cliente Prisma para SQLite e aplica as migrações locais. Não publique `.env` nem URLs reais de banco. O servidor disponibiliza `GET /health`.

## Testes e build

```bash
npm run db:setup
npm test
npm run build
```

Os testes usam SQLite local e cobrem filtro/paginação, cálculo da média do feedback, incremento de upvotes, validações, respostas 400/404 e documentação.

## Endpoints

| Método | Rota | Comportamento |
|---|---|---|
| POST | `/api/profiles` | Cadastra perfil com validação |
| GET | `/api/profiles/:id` | Busca perfil por ID |
| POST | `/api/technologies` | Cadastra tecnologia |
| GET | `/api/technologies` | Lista tecnologias |
| POST | `/api/projects` | Cadastra projeto e associa perfil/tecnologias |
| GET | `/api/projects?page=1&limit=10` | Lista projetos com paginação |
| GET | `/api/projects?technology=TypeScript&page=1&limit=10` | Filtra por nome exato da tecnologia |
| GET | `/api/projects?technologyId=1&page=1&limit=10` | Filtra pelo ID da tecnologia |
| POST | `/api/projects/:id/feedbacks` | Cria feedback com nota de 1 a 5 e recalcula a média |
| PUT | `/api/projects/:id/upvote` | Incrementa em 1 o total de upvotes |
| GET | `/api-docs/` | Abre Swagger UI |
| GET | `/api-docs.json` | Retorna especificação OpenAPI em JSON |

A resposta paginada de projetos tem o formato `{ "data": [], "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 } }`. Erros são retornados em JSON com `error`, `message` e, em validações, `details`.

### Exemplo de feedback

```json
{
  "rating": 5,
  "comment": "Projeto muito bem organizado!",
  "author": "Pessoa avaliadora"
}
```

## Demonstração no Postman

Importe o arquivo `DevShowcase.postman_collection.json` no Postman. Na coleção, mantenha a ordem das requisições: criar perfil, criar tecnologia, criar projeto, listar/filtrar projetos, enviar feedback, incrementar upvote e demonstrar erros 400 e 404. Os scripts da coleção salvam automaticamente os IDs retornados, então não é necessário preencher nenhum ID manualmente. Para usar uma API hospedada, altere apenas a variável `baseUrl` da coleção.

Também é possível abrir `requests.http` no VS Code, mas a coleção Postman é a opção recomendada para a apresentação.

## Modelagem relacional

`Profile 1:N Project`; `Project N:N Technology`, por meio de `ProjectTechnology`; e `Project 1:N Feedback`. As restrições e relações estão definidas no Prisma.

## Deploy contínuo no Render

O arquivo `render.yaml` descreve uma API Node e um PostgreSQL conectados por variável de ambiente, além do health check. Para criar a infraestrutura a partir do repositório, use o Blueprint do Render após enviar o projeto a um repositório GitHub:

1. No GitHub, crie um repositório público vazio e envie o conteúdo deste projeto, sem `node_modules`, `.env` ou arquivos de banco local.
2. No Render, escolha criar um Blueprint e conecte o repositório.
3. Revise os recursos do `render.yaml` e confirme a criação do serviço e banco. O Render passa a publicar novos commits automaticamente.
4. Depois do deploy, abra a URL pública do serviço e valide `/health`, `/api-docs/` e os endpoints via Postman.
5. Copie a URL pública da API e inclua-a na entrega da atividade.

O serviço usa `DATABASE_URL` configurada a partir do banco no Render; segredos ficam no painel do provedor e não devem ser enviados ao GitHub. A aplicação executa `prisma migrate deploy` ao iniciar o serviço.

**Limitações do plano gratuito:** conforme a documentação oficial do Render consultada em 24/09/2026, serviços web gratuitos entram em suspensão após 15 minutos sem tráfego e o PostgreSQL gratuito expira após 30 dias; também não oferece backup gerenciado. Portanto, o plano gratuito serve para demonstração/atividade, mas não é indicado para guardar dados importantes nem para produção real. Confira os termos atuais antes de confirmar a criação do banco.

## Fontes oficiais

- [Render Blueprint YAML Reference](https://render.com/docs/blueprint-spec)
- [Render: Deploy for Free e limitações](https://render.com/docs/free)

## Estrutura do projeto

```text
src/
  controllers/       lógica das rotas
  lib/               cliente Prisma
  middlewares/       tratamento global de erros
  routes/            rotas REST
  schemas/           validação de entrada com Zod
  app.ts             configuração Express e Swagger
  openapi.ts         contrato OpenAPI
  server.ts          inicialização do servidor
prisma/
  schema.prisma      banco SQLite local
  migrations/        migrações SQLite existentes
  postgres/
    schema.prisma    schema PostgreSQL para o Render
    migrations/      migração inicial PostgreSQL
DevShowcase.postman_collection.json
render.yaml
```

## Entrega acadêmica

Grave o vídeo como não listado no YouTube e prepare o PDF com os links do repositório, API pública e vídeo, conforme a atividade. A publicação do vídeo e o envio do PDF devem ser feitos pelo grupo.
