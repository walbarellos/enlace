import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import { dbPool } from '../Shared/Infrastructure/Database.js';
import { AuthTokenService, TokenPayload } from '../Shared/Infrastructure/AuthTokenService.js';
import {
  RegisterAccountSchema,
  LoginSchema,
  ProviderSearchQuerySchema,
  CreateServiceRequestSchema,
  CreateOrderCheckoutSchema,
  PixWebhookSchema,
  SubmitReviewSchema
} from '../Shared/Presentation/ValidationSchemas.js';

import { RegisterAccountUseCase } from '../Identity/Application/RegisterAccountUseCase.js';
import { LoginUseCase } from '../Identity/Application/LoginUseCase.js';
import { SearchProvidersUseCase } from '../Discovery/Application/SearchProvidersUseCase.js';
import { CreateServiceRequestUseCase } from '../Requests/Application/CreateServiceRequestUseCase.js';
import { CheckoutOrderUseCase } from '../Commerce/Application/CheckoutOrderUseCase.js';
import { ProcessPixWebhookUseCase } from '../Commerce/Application/ProcessPixWebhookUseCase.js';
import { AccessMediaUseCase } from '../Content/Application/AccessMediaUseCase.js';
import { SubmitReviewUseCase } from '../TrustSafety/Application/SubmitReviewUseCase.js';
import { WebUIHtml } from './WebUI.js';

// Extensão de tipos do Fastify
declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

export function buildServer(): FastifyInstance {
  const app = fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true
  });

  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  // Middleware de Autenticação Opcional/Obrigatória
  const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        type: 'https://enlace.app/errors/unauthorized',
        title: 'Não Autorizado',
        status: 401,
        detail: 'Token JWT ausente ou malformatado no cabeçalho Authorization'
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = AuthTokenService.verifyToken(token);

    if (!payload) {
      return reply.status(401).send({
        type: 'https://enlace.app/errors/invalid-token',
        title: 'Token Inválido',
        status: 401,
        detail: 'Token JWT expirado ou inválido'
      });
    }

    req.user = payload;
  };

  const optionalAuth = async (req: FastifyRequest) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = AuthTokenService.verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }
  };

  // ==========================================================================
  // 0. WEB INTERFACE (FRONTEND ACESSÍVEL WCAG 2.1 AA)
  // ==========================================================================
  app.get('/', async (_req, reply) => {
    return reply.type('text/html; charset=utf-8').send(WebUIHtml);
  });

  // ==========================================================================
  // 1. HEALTH CHECK & STATUS
  // ==========================================================================
  app.get('/api/v1/health', async (_req, reply) => {
    try {
      const dbRes = await dbPool.query('SELECT 1 as is_alive, NOW() as current_time');
      return reply.send({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: dbRes.rows[0].is_alive === 1 ? 'CONNECTED' : 'DISCONNECTED',
        architecture: 'Modular Monolith (DDD + Hexagonal)',
        version: '1.0.0'
      });
    } catch (err: any) {
      return reply.status(503).send({
        status: 'DOWN',
        database: 'ERROR',
        error: err.message
      });
    }
  });

  // ==========================================================================
  // 2. IDENTIDADE & AUTENTICAÇÃO
  // ==========================================================================
  app.post('/api/v1/auth/register', async (req, reply) => {
    const parseRes = RegisterAccountSchema.safeParse(req.body);
    if (!parseRes.success) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/validation',
        title: 'Dados inválidos',
        status: 400,
        errors: parseRes.error.errors
      });
    }

    const result = await RegisterAccountUseCase.execute(parseRes.data);
    if (!result.isSuccess) {
      const errDetail = result.error || 'Erro desconhecido';
      const isUnderage = errDetail.includes('menores de 18') || errDetail.includes('Idade');
      return reply.status(isUnderage ? 403 : 400).send({
        type: isUnderage ? 'https://enlace.app/errors/underage-denied' : 'https://enlace.app/errors/registration-failed',
        title: isUnderage ? 'Acesso Proibido (+18)' : 'Erro no Registro',
        status: isUnderage ? 403 : 400,
        detail: errDetail
      });
    }

    return reply.status(201).send(result.value);
  });

  app.post('/api/v1/auth/login', async (req, reply) => {
    const parseRes = LoginSchema.safeParse(req.body);
    if (!parseRes.success) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/validation',
        title: 'Dados inválidos',
        status: 400,
        errors: parseRes.error.errors
      });
    }

    const result = await LoginUseCase.execute(parseRes.data);
    if (!result.isSuccess) {
      return reply.status(401).send({
        type: 'https://enlace.app/errors/invalid-credentials',
        title: 'Autenticação Falhou',
        status: 401,
        detail: result.error
      });
    }

    return reply.status(200).send(result.value);
  });

  // ==========================================================================
  // 3. DESCOBERTA & BUSCA COM ACESSIBILIDADE
  // ==========================================================================
  app.get('/api/v1/providers/search', async (req, reply) => {
    const parseRes = ProviderSearchQuerySchema.safeParse(req.query);
    if (!parseRes.success) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/validation',
        title: 'Parâmetros de busca inválidos',
        status: 400,
        errors: parseRes.error.errors
      });
    }

    const result = await SearchProvidersUseCase.execute(parseRes.data);
    if (!result.isSuccess) {
      return reply.status(500).send({
        type: 'https://enlace.app/errors/search-error',
        title: 'Erro na Busca',
        status: 500,
        detail: result.error
      });
    }

    return reply.status(200).send({
      count: result.value.length,
      items: result.value
    });
  });

  // ==========================================================================
  // 4. SOLICITAÇÃO DE ATENDIMENTO (CARTÃO ESTRUTURADO + DEEP LINK)
  // ==========================================================================
  app.post('/api/v1/requests', { preHandler: [authenticate] }, async (req, reply) => {
    const parseRes = CreateServiceRequestSchema.safeParse(req.body);
    if (!parseRes.success) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/validation',
        title: 'Dados da solicitação inválidos',
        status: 400,
        errors: parseRes.error.errors
      });
    }

    const result = await CreateServiceRequestUseCase.execute(req.user!.accountId, parseRes.data);
    if (!result.isSuccess) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/request-failed',
        title: 'Erro ao gerar solicitação',
        status: 400,
        detail: result.error
      });
    }

    return reply.status(201).send(result.value);
  });

  // ==========================================================================
  // 5. COMMERCE & PIX CHECKOUT (SPLIT 85/15)
  // ==========================================================================
  app.post('/api/v1/orders/checkout', { preHandler: [authenticate] }, async (req, reply) => {
    const parseRes = CreateOrderCheckoutSchema.safeParse(req.body);
    if (!parseRes.success) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/validation',
        title: 'Dados da ordem inválidos',
        status: 400,
        errors: parseRes.error.errors
      });
    }

    const result = await CheckoutOrderUseCase.execute(req.user!.accountId, parseRes.data);
    if (!result.isSuccess) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/order-failed',
        title: 'Erro ao gerar cobrança Pix',
        status: 400,
        detail: result.error
      });
    }

    return reply.status(201).send(result.value);
  });

  // Webhook Pix Simulado
  app.post('/api/v1/webhooks/pix', async (req, reply) => {
    const parseRes = PixWebhookSchema.safeParse(req.body);
    if (!parseRes.success) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/validation',
        title: 'Payload do webhook inválido',
        status: 400,
        errors: parseRes.error.errors
      });
    }

    const result = await ProcessPixWebhookUseCase.execute(parseRes.data);
    if (!result.isSuccess) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/webhook-error',
        title: 'Erro ao processar Webhook Pix',
        status: 400,
        detail: result.error
      });
    }

    return reply.status(200).send(result.value);
  });

  // ==========================================================================
  // 6. CONTEÚDO DIGITAL & PAYWALL (WATERMARK FORENSE)
  // ==========================================================================
  app.get('/api/v1/content/:assetId/access', { preHandler: [optionalAuth] }, async (req, reply) => {
    const { assetId } = req.params as { assetId: string };
    const requestingAccountId = req.user?.accountId;

    const result = await AccessMediaUseCase.execute(assetId, requestingAccountId);
    if (!result.isSuccess) {
      return reply.status(404).send({
        type: 'https://enlace.app/errors/not-found',
        title: 'Mídia não encontrada',
        status: 404,
        detail: result.error
      });
    }

    const mediaOutput = result.value;
    if (!mediaOutput.accessGranted) {
      return reply.status(402).send({
        type: 'https://enlace.app/errors/payment-required',
        title: 'Pagamento Necessário',
        status: 402,
        detail: mediaOutput.denialReason || 'Acesso restrito por paywall',
        data: {
          assetId: mediaOutput.assetId,
          priceCents: mediaOutput.priceCents,
          thumbnailBlurUrl: mediaOutput.thumbnailBlurUrl
        }
      });
    }

    return reply.status(200).send(mediaOutput);
  });

  // ==========================================================================
  // 7. AVALIAÇÕES BILATERAIS & CANAL CONFIDENCIAL DE SEGURANÇA
  // ==========================================================================
  app.post('/api/v1/reviews', { preHandler: [authenticate] }, async (req, reply) => {
    const parseRes = SubmitReviewSchema.safeParse(req.body);
    if (!parseRes.success) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/validation',
        title: 'Dados da avaliação inválidos',
        status: 400,
        errors: parseRes.error.errors
      });
    }

    const result = await SubmitReviewUseCase.execute(req.user!.accountId, parseRes.data);
    if (!result.isSuccess) {
      return reply.status(400).send({
        type: 'https://enlace.app/errors/review-error',
        title: 'Erro ao registrar avaliação',
        status: 400,
        detail: result.error
      });
    }

    return reply.status(201).send(result.value);
  });

  return app;
}
