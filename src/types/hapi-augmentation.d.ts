import { create_db } from '@/db';
import type { Server, ValidationOptions } from '@hapi/hapi';

declare module '@hapi/hapi' {
  /**
   * A validation module registered with server.validator().
   * @template S Raw schema type (e.g. ZodType, Yup.Schema, Joi.Schema)
   * @template C Compiled schema type returned by compile()
   */
  export interface ServerValidator<S = any, C = any> {
    /** 
     * Turn your raw schema into an internal validator.
     */
    compile(schema: S): C;
    /**
     * (Optional) Run validation at request time.
     * Throw to signal failure, or return { value } on success.
     */
    validate?(compiled: C, value: unknown, options?: any): { value: any } | never;
  }

  interface Server {
    /**
     * Replace Hapi’s built-in validator (Joi) with your own.
     * Now strongly typed to require your ServerValidator.
     */
    validator<S = any, C = any>(validator: ServerValidator<S, C>): void;
  }

  type ValidationOptions = {
    [option: string]: string
  }

  type Validator<T> = ((value: object | Buffer | string, options: ValidationOptions) => Promise<T>)

}

