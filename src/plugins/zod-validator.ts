import { ServerValidator, Validator } from "@hapi/hapi"
import { Boom, badData as boom_bad_data } from "@hapi/boom"

import { z, ZodMiniType } from "@zod/mini"

export const zod_adapter: ServerValidator = {
  compile: <A>(schema: z.ZodMiniType<unknown, A>) => {
    return zod_validator<A>(schema, boom_bad_data('Invalid Data Shape'))
  }
}

export const zod_validator: <A>(schema: ZodMiniType<unknown, A>, boom?: Boom<unknown>) => Validator<A> = (schema, boom) => async (value, _) => {
  const { data: parsed_data, error: parse_error } = schema.safeParse(value);

  if (parse_error) {
    throw boom || boom_bad_data()
  }

  return parsed_data
}
