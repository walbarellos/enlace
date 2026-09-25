import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'enlace_dev_jwt_secret_must_be_changed_in_prod_!@#$';

export interface TokenPayload {
  accountId: string;
  role: 'CLIENT' | 'PROVIDER' | 'MODERATOR' | 'ADMIN';
  pseudonym?: string;
  artisticName?: string;
  verificationLevel: string;
}

export class AuthTokenService {
  private static readonly SALT_ROUNDS = 10;

  public static async hashPassword(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  public static async comparePassword(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  public static generateToken(payload: TokenPayload, expiresIn: string = '24h'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
  }

  public static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }
}
