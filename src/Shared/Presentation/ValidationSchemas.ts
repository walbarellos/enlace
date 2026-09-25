import { z } from 'zod';

// ============================================================================
// 1. SCHEMAS DE AUTENTICAÇÃO E CONTA
// ============================================================================

export const RegisterAccountSchema = z.object({
  email: z.string().email('E-mail inválido').max(255),
  password: z
    .string()
    .min(8, 'A senha deve conter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter ao menos um caractere especial'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve estar no formato AAAA-MM-DD'),
  role: z.enum(['CLIENT', 'PROVIDER']),
  phone_number: z.string().optional(),
  // Campos específicos de Prestador
  artistic_name: z.string().min(2).max(128).optional(),
  state_uf: z.string().length(2).toUpperCase().optional(),
  city: z.string().min(2).max(128).optional(),
  neighborhood: z.string().min(2).max(128).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  min_rate_cents: z.number().int().nonnegative().optional()
});

export type RegisterAccountDTO = z.infer<typeof RegisterAccountSchema>;

export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória')
});

export type LoginDTO = z.infer<typeof LoginSchema>;

// ============================================================================
// 2. SCHEMAS DE BUSCA E CATÁLOGO (ANTI-SCRAPING)
// ============================================================================

export const ProviderSearchQuerySchema = z.object({
  state_uf: z.string().length(2, 'UF deve conter exatamente 2 caracteres').toUpperCase(),
  city: z.string().min(2, 'Nome da cidade obrigatório').max(128),
  neighborhood: z.string().max(128).optional(),
  accommodations: z
    .union([z.string().transform((val) => [val]), z.array(z.string())])
    .optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  radius_meters: z.coerce.number().min(500).max(100000).default(50000),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20)
});

export type ProviderSearchQueryDTO = z.infer<typeof ProviderSearchQuerySchema>;

// ============================================================================
// 3. SCHEMAS DE SOLICITAÇÃO E CONEXÃO EXTERNA
// ============================================================================

export const CreateServiceRequestSchema = z.object({
  provider_id: z.string().uuid('ID do prestador inválido'),
  requested_datetime: z.string().datetime('Data e hora no formato ISO 8601'),
  duration_hours: z.number().int().min(1).max(24),
  location_mode: z.enum(['OWN_PLACE', 'CLIENT_PLACE', 'HOTEL_MOTEL', 'VIRTUAL']),
  channel: z.enum(['WHATSAPP', 'TELEGRAM']),
  accommodations: z.array(z.string()).default([])
});

export type CreateServiceRequestDTO = z.infer<typeof CreateServiceRequestSchema>;

// ============================================================================
// 4. SCHEMAS FINANCEIROS E CHECKOUT PIX
// ============================================================================

export const CreateOrderCheckoutSchema = z.object({
  item_type: z.enum(['MEDIA_SINGLE', 'SUBSCRIPTION_TIER']),
  target_id: z.string().uuid('ID do ativo ou plano inválido'),
  payment_method: z.enum(['PIX', 'CREDIT_CARD']).default('PIX')
});

export type CreateOrderCheckoutDTO = z.infer<typeof CreateOrderCheckoutSchema>;

export const PixWebhookSchema = z.object({
  gateway_transaction_id: z.string(),
  order_id: z.string().uuid(),
  status: z.enum(['PAID', 'EXPIRED', 'FAILED']),
  paid_amount_cents: z.number().int().positive()
});

export type PixWebhookDTO = z.infer<typeof PixWebhookSchema>;

// ============================================================================
// 5. SCHEMAS DE AVALIAÇÃO BILATERAL E SEGURANÇA
// ============================================================================

export const SubmitReviewSchema = z.object({
  service_request_id: z.string().uuid('ID de solicitação obrigatório'),
  rating_score: z.number().int().min(1).max(5),
  public_comment: z.string().max(1000).optional(),
  confidential_alert: z
    .object({
      incident_code: z.enum([
        'CONSENT_BREACH',
        'VERBAL_AGGRESSION',
        'PHYSICAL_AGGRESSION',
        'SCAM_ATTEMPT',
        'UNAUTHORIZED_RECORDING',
        'UNDERAGE_SUSPICION'
      ]),
      risk_weight: z.number().int().min(1).max(10),
      narrative: z.string().max(2000).optional()
    })
    .optional()
});

export type SubmitReviewDTO = z.infer<typeof SubmitReviewSchema>;
