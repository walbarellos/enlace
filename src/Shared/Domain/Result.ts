// ============================================================================
// PLATAFORMA ENLACE — SHARED DOMAIN
// Arquivo: src/Shared/Domain/Result.ts
// ============================================================================

export class Result<T, E = string> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly error?: E,
    private readonly _value?: T
  ) {}

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cannot retrieve value from a failed Result: ${JSON.stringify(this.error)}`);
    }
    return this._value as T;
  }

  public get value(): T {
    return this.getValue();
  }

  public static ok<T, E = string>(value: T): Result<T, E> {
    return new Result<T, E>(true, undefined, value);
  }

  public static fail<T, E = string>(error: E): Result<T, E> {
    return new Result<T, E>(false, error);
  }
}
