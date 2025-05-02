import { ServerValidator, Validator } from "@hapi/hapi"
import { badData as Boom_badData } from "@hapi/boom"

import { z, ZodMiniType } from "@zod/mini"

const zod_adapter: ServerValidator = {
  compile: <S>(schema: z.ZodMiniType<S>) => schema,
  // (optional) provide validate() if you want Hapi to call it:
  validate: <S>(compiled: z.ZodMiniType<S>, value: unknown) => {
    const result = compiled.safeParse(value);
    if (!result.success) {
      // Throwing a Boom error signals HTTP 400 Bad Request
      throw Boom_badData('Invalid request payload input');
    }
    return { value: result.data };
  }
}

const zod_validator: <A>(schema: ZodMiniType<any, A>) => Validator<A> = (schema) => async (value, _) => {
  const { data: parsed_data, error: parse_error } = schema.safeParse(value);

  if (parse_error) {
    throw Boom_badData('Invalid request payload input')
  }

  return parsed_data
}

export { zod_adapter, zod_validator }
