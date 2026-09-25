const jsonBody = (schema: object) => ({ required: true, content: { 'application/json': { schema } } });
const idParam = { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } };

export const openApiSpec = {
  openapi: '3.0.3',
  info: { title: 'DevShowcase API', version: '1.0.0', description: 'API REST para perfis de desenvolvedores, projetos, tecnologias e feedbacks.' },
  servers: [{ url: '/', description: 'Servidor atual' }],
  paths: {
    '/health': { get: { summary: 'Verifica a saúde da API', responses: { '200': { description: 'Serviço ativo' } } } },
    '/api/profiles': { post: { summary: 'Cadastra perfil', requestBody: jsonBody({ $ref: '#/components/schemas/ProfileInput' }), responses: { '201': { description: 'Perfil criado' }, '400': { description: 'Dados inválidos' }, '409': { description: 'E-mail já cadastrado' } } } },
    '/api/profiles/{id}': { get: { summary: 'Busca perfil pelo ID', parameters: [idParam], responses: { '200': { description: 'Perfil encontrado' }, '400': { description: 'ID inválido' }, '404': { description: 'Perfil não encontrado' } } } },
    '/api/technologies': {
      post: { summary: 'Cadastra tecnologia', requestBody: jsonBody({ $ref: '#/components/schemas/TechnologyInput' }), responses: { '201': { description: 'Tecnologia criada' }, '400': { description: 'Dados inválidos' }, '409': { description: 'Tecnologia já cadastrada' } } },
      get: { summary: 'Lista tecnologias', responses: { '200': { description: 'Lista de tecnologias' } } }
    },
    '/api/projects': {
      post: { summary: 'Cadastra projeto e relaciona tecnologias', requestBody: jsonBody({ $ref: '#/components/schemas/ProjectInput' }), responses: { '201': { description: 'Projeto criado' }, '400': { description: 'Dados inválidos ou referência inválida' } } },
      get: {
        summary: 'Lista projetos com filtro e paginação',
        parameters: [
          { in: 'query', name: 'technology', schema: { type: 'string' }, description: 'Nome exato da tecnologia' },
          { in: 'query', name: 'technologyId', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } }
        ], responses: { '200': { description: 'Projetos e dados de paginação' }, '400': { description: 'Parâmetros inválidos' } }
      }
    },
    '/api/projects/{id}/feedbacks': {
      post: {
        summary: 'Registra feedback e atualiza a média do projeto',
        parameters: [idParam],
        requestBody: jsonBody({ $ref: '#/components/schemas/FeedbackInput' }),
        responses: { '201': { description: 'Feedback criado e média recalculada' }, '400': { description: 'Dados inválidos' }, '404': { description: 'Projeto não encontrado' } }
      }
    },
    '/api/projects/{id}/upvote': {
      put: {
        summary: 'Incrementa as curtidas do projeto em uma unidade',
        parameters: [idParam],
        responses: { '200': { description: 'Projeto atualizado' }, '400': { description: 'ID inválido' }, '404': { description: 'Projeto não encontrado' } }
      }
    }
  },
  components: {
    schemas: {
      ProfileInput: { type: 'object', required: ['name', 'email'], properties: { name: { type: 'string', minLength: 2 }, email: { type: 'string', format: 'email' }, bio: { type: 'string', maxLength: 500 }, avatarUrl: { type: 'string', format: 'uri' } } },
      TechnologyInput: { type: 'object', required: ['name'], properties: { name: { type: 'string', minLength: 2 }, category: { type: 'string', maxLength: 80 } } },
      ProjectInput: { type: 'object', required: ['title', 'description', 'profileId'], properties: { title: { type: 'string', minLength: 3 }, description: { type: 'string', minLength: 10 }, repositoryUrl: { type: 'string', format: 'uri' }, deployUrl: { type: 'string', format: 'uri' }, profileId: { type: 'integer', minimum: 1 }, technologyIds: { type: 'array', items: { type: 'integer', minimum: 1 } } } },
      FeedbackInput: { type: 'object', required: ['rating', 'comment'], properties: { rating: { type: 'integer', minimum: 1, maximum: 5 }, comment: { type: 'string', minLength: 1, maxLength: 1000 }, author: { type: 'string', default: 'Anônimo' } } },
      Error: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' }, details: { type: 'array', items: { type: 'object' } } } }
    }
  }
} as const;
