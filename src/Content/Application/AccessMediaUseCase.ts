import { randomUUID } from 'crypto';
import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import { ContentAccessPolicy } from '../Domain/ContentAccessPolicy.js';

export interface AccessMediaOutput {
  assetId: string;
  accessGranted: boolean;
  title: string | null;
  mediaType: string;
  playbackUrl?: string;
  thumbnailBlurUrl: string;
  priceCents: number;
  watermarkToken?: string;
  denialReason?: string;
}

export class AccessMediaUseCase {
  public static async execute(
    assetId: string,
    requestingAccountId?: string
  ): Promise<Result<AccessMediaOutput>> {
    try {
      const assetRes = await dbPool.query(
        `SELECT a.id, a.provider_id, a.media_type, a.access_tier, a.price_cents,
                a.title, a.processed_s3_key, a.hls_playlist_s3_key, a.thumbnail_blur_s3_key,
                a.status, p.account_id as provider_account_id
         FROM public.content_assets a
         JOIN public.provider_profiles p ON p.id = a.provider_id
         WHERE a.id = $1`,
        [assetId]
      );

      if (assetRes.rows.length === 0) {
        return Result.fail('Mídia não encontrada');
      }

      const asset = assetRes.rows[0];

      if (asset.status !== 'ACTIVE') {
        return Result.fail('Mídia indisponível no momento');
      }

      // Verifica se o solicitante possui entitlement ativo
      let userEntitlement = null;
      let pseudonym: string = 'Visitante_Anonimo';

      if (requestingAccountId) {
        const entRes = await dbPool.query(
          `SELECT id, account_id, content_asset_id, is_revoked, expires_at
           FROM public.entitlements
           WHERE account_id = $1 AND content_asset_id = $2 AND is_revoked = FALSE`,
          [requestingAccountId, asset.id]
        );
        if (entRes.rows.length > 0) {
          const row = entRes.rows[0];
          userEntitlement = {
            id: row.id,
            accountId: row.account_id,
            contentAssetId: row.content_asset_id,
            isRevoked: row.is_revoked,
            expiresAt: row.expires_at ? new Date(row.expires_at) : null
          };
        }

        const profileRes = await dbPool.query(
          `SELECT pseudonym FROM public.client_profiles WHERE account_id = $1`,
          [requestingAccountId]
        );
        if (profileRes.rows.length > 0) {
          pseudonym = profileRes.rows[0].pseudonym;
        }
      }

      // Avaliação formal via Policy Engine
      const policyDecision = ContentAccessPolicy.canAccess(
        requestingAccountId || '',
        {
          id: asset.id,
          providerAccountId: asset.provider_account_id,
          tier: asset.access_tier,
          isActive: true,
          status: asset.status
        },
        userEntitlement
      );

      if (!policyDecision.isAllowed) {
        return Result.ok({
          assetId: asset.id,
          accessGranted: false,
          title: asset.title,
          mediaType: asset.media_type,
          thumbnailBlurUrl: asset.thumbnail_blur_s3_key,
          priceCents: asset.price_cents,
          denialReason: policyDecision.reason
        });
      }

      // Acesso Concedido: Registra log de acesso forense e esteganografia
      const playbackSessionToken = `session_${randomUUID()}`;
      if (requestingAccountId) {
        await dbPool.query(
          `INSERT INTO public.content_access_logs (
             account_id, content_asset_id, watermark_identifier, playback_session_token
           ) VALUES ($1, $2, $3, $4)`,
          [requestingAccountId, asset.id, pseudonym, playbackSessionToken]
        );
      }

      const playbackUrl =
        asset.hls_playlist_s3_key ||
        asset.processed_s3_key ||
        `https://cdn.enlace.app/media/${asset.id}/master.m3u8`;

      return Result.ok({
        assetId: asset.id,
        accessGranted: true,
        title: asset.title,
        mediaType: asset.media_type,
        playbackUrl,
        thumbnailBlurUrl: asset.thumbnail_blur_s3_key,
        priceCents: asset.price_cents,
        watermarkToken: playbackSessionToken
      });
    } catch (err: any) {
      return Result.fail(`Erro ao acessar mídia: ${err.message}`);
    }
  }
}
