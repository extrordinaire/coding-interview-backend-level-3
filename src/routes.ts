import Hapi, { Server } from "@hapi/hapi";
import { create_db } from "./db";
import { items, T_ITEM } from "./db/schema";
import { eq } from "drizzle-orm";

import { async_unwrap } from "@/lib/wrapped";
import { minLength, z } from "@zod/mini";
import { S_ITEM } from "./db/schema";

import {
  internal as boom_internal,
  notFound as boom_not_found,
} from "@hapi/boom";

const S_ITEM_ID = z.coerce
  .number()
  .check(
    z.int('Field "id" must be integer'),
    z.positive('Field "id" cannot be negative'),
  );
const S_ITEM_PRICE = z.coerce
  .number('Field "price" is required')
  .check(
    z.int('Field "price" must be integer'),
    z.positive('Field "price" cannot be negative'),
  );
const S_ITEM_NAME = z.string().check(minLength(1));

const db = create_db();

const validation_fail_action: Hapi.Lifecycle.FailAction = async (
  request,
  h,
  err,
) => {
  const details = (err as Error).cause as {};

  return h.response({ errors: details }).code(400).takeover();
};

export const define_routes = (server: Server) => {
  server.route({
    method: "GET",
    path: "/ping",
    handler: async () => {
      return {
        ok: true,
      };
    },
  });

  server.route({
    method: "GET",
    path: "/items",
    options: {
      response: {
        schema: z.array(S_ITEM),
        failAction: "error",
      },
    },
    handler: async (request, h) => {
      const { error, value } = await async_unwrap(
        db.select().from(items).orderBy(items.id),
      );

      if (error) {
        return boom_internal(error);
      }

      if (!value) {
        return boom_not_found("Item not found");
      }

      if (value) {
        return h.response(value);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/items/{id}",
    options: {
      validate: {
        params: z.object({ id: S_ITEM_ID }),
        failAction: validation_fail_action,
      },
      response: {
        schema: S_ITEM,
        failAction: "error",
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { error, value } = await async_unwrap(
        db
          .select()
          .from(items)
          .where(eq(items.id, Number(id)))
          .limit(1)
          .then((rows) => rows[0]),
      );

      if (error) {
        return boom_internal(error);
      }

      if (!value) {
        return boom_not_found("Item not found");
      }

      if (value) {
        return h.response(value);
      }
    },
  });

  // Define the /items route to create a new item
  server.route({
    method: "POST",
    path: "/items",
    options: {
      validate: {
        payload: z.object({
          price: S_ITEM_PRICE,
          name: S_ITEM_NAME,
        }),
        failAction: validation_fail_action,
      },
      response: {
        schema: S_ITEM,
      },
    },
    handler: async (request, h) => {
      const { value, error } = await async_unwrap(
        db
          .insert(items)
          .values(request.payload as T_ITEM)
          .returning(),
      );

      if (error) {
        boom_internal(error);
      }

      if (value) {
        return h.response(value?.pop()).code(201);
      }
    },
  });

  // Define the /items/{id} route to update an existing item partially
  server.route({
    method: "PUT",
    path: "/items/{id}",
    options: {
      validate: {
        params: z.object({ id: S_ITEM_ID }),
        payload: z.object({
          name: z.optional(S_ITEM_NAME),
          price: z.optional(S_ITEM_PRICE),
        }),
        failAction: validation_fail_action,
      },
      response: {
        schema: S_ITEM,
        failAction: "error",
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;

      const { value, error } = await async_unwrap(
        db
          .update(items)
          .set(request.payload as T_ITEM)
          .where(eq(items.id, Number(id)))
          .returning(),
      );

      if (error) {
        boom_internal(error);
      }

      if (value) {
        return h.response(value?.pop()).code(200);
      }
    },
  });

  // Define the /items/{id} route to delete an item
  server.route({
    method: "DELETE",
    path: "/items/{id}",
    options: {
      validate: {
        params: z.object({
          id: S_ITEM_ID,
        }),
        failAction: validation_fail_action,
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;

      const { value, error } = await async_unwrap(
        db
          .delete(items)
          .where(eq(items.id, Number(id)))
          .returning(),
      );

      if (error) {
        return boom_internal(error);
      }

      if (value.length === 0) {
        return boom_not_found("Item not found");
      }

      if (value.length > 0) {
        return h.response().code(204);
      }
    },
  });
};
