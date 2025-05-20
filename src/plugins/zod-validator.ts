import { ServerValidator, Validator } from "@hapi/hapi";
import {
  Boom,
  badData as boom_bad_data,
  badRequest as boom_bad_request,
} from "@hapi/boom";

import { z, ZodMiniType } from "@zod/mini";
import { format_zod_error } from "@/lib/format_zod_error";

export const zod_adapter: ServerValidator = {
  compile: <A>(schema: z.ZodMiniType<unknown, A>) => {
    return zod_validator<A>(schema);
  },
};

export const zod_validator: <A>(
  schema: ZodMiniType<unknown, A>,
  boom?: Boom<unknown>,
) => Validator<A> = (schema, boom) => async (value, _) => {
  const { data: parsed_data, error: parse_error } = schema.safeParse(value);

  if (parse_error) {
    const formatted_zod_error = format_zod_error(parse_error);

    throw new Error("Error while formatting data.", {
      cause: formatted_zod_error,
    });
  }

  return parsed_data;
};
