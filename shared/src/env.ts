export type EnvValues = Record<string, string | undefined>;

declare const process: { env: EnvValues };

export class EnvService {
  constructor(private readonly values: EnvValues) {}

  get(name: string): string | undefined {
    return this.values[name];
  }

  set(name: string, value: string): void {
    this.values[name] = value;
  }

  getRequired(name: string, message?: string): string {
    const value = this.get(name);

    if (!value) {
      throw new Error(message ?? `${name} is not set`);
    }

    return value;
  }

  getBoolean(name: string): boolean | undefined {
    const value = this.get(name);

    if (value === undefined || value === "") {
      return undefined;
    }

    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  }
}

export const createEnvService = (values: EnvValues = process.env): EnvService =>
  new EnvService(values);
