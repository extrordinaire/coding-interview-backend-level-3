import { Server } from "@hapi/hapi"
import { db } from "./db";
import { items, T_ITEM } from "./db/schema";
import { eq } from "drizzle-orm";

import { async_unwrap } from '@/lib/wrapped'
import { check, z } from "@zod/mini"
import { S_ITEM } from "./db/schema"
import { zod_validator } from "./plugins/zod-validator";

import { internal as boom_internal, notFound as boom_not_found, badRequest as boom_bad_request } from "@hapi/boom"

export const define_routes = (server: Server) => {
  server.route({
    method: 'GET',
    path: '/ping',
    handler: async (request, h) => {
      return {
        ok: true
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/items/{id}',
    options: {
      validate: {
        params: z.object({
          id: z.coerce.number().check(z.int(), z.minimum(1))
        })
      },
      response: {
        schema: S_ITEM,
        failAction: 'error'
      }
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const {
        error,
        value,
      } = await async_unwrap(
        db.select()
          .from(items)
          .where(eq(items.id, Number(id)))
          .limit(1)
          .then(rows => rows[0])
      )

      if (error) {
        return boom_internal(error)
      }

      if (!value) {
        return boom_not_found('Item not found')
      }

      if (value) {
        return h.response(value);
      }

    },
  });

  // Define the /items route to create a new item
  server.route({
    method: 'POST',
    path: '/items',
    options: {
      validate: {
        payload: z.object({
          price_cents: z.coerce.number().check(z.int()),
          name: z.string().check(z.minLength(1))
        })
      },
      response: {
        schema: S_ITEM,
        failAction: 'error'
      }
    },
    handler: async (request, h) => {

      const { value, error } = await async_unwrap(
        db.insert(items).values(request.payload as T_ITEM).returning()
      )

      if (error) {
        boom_internal(error)
      }

      if (value) {
        return h.response(value?.pop()).code(201)
      }
    },
  });

  // Define the /items/{id} route to update an existing item partially
  server.route({
    method: 'PATCH',
    path: '/items/{id}',
    options: {
      validate: {
        params: z.object({
          id: z.coerce.number().check(z.int(), z.minimum(1))
        }),
        payload: z.union([
          z.object({
            name: z.string().check(z.minLength(1)),
            price_cents: z.optional(z.number().check(z.int())),
          }),
          z.object({
            name: z.optional(z.string().check(z.minLength(1))),
            price_cents: z.number().check(z.int()),
          }),
        ]),
      },
      response: {
        schema: S_ITEM,
        failAction: 'error'
      }
    },
    handler: async (request, h) => {
      const { id } = request.params;

      const { value, error } = await async_unwrap(
        db
          .update(items)
          .set(request.payload as T_ITEM)
          .where(eq(items.id, Number(id)))
          .returning()
      )

      if (error) {
        boom_internal(error)
      }

      if (value) {
        return h.response(value?.pop()).code(201)
      }
    },
  });

  // Define the /items/{id} route to delete an item
  server.route({
    method: 'DELETE',
    path: '/items/{id}',
    options: {
      validate: {
        params: z.object({
          id: z.coerce.number().check(z.int(), z.minimum(1))
        })
      },
      //response: {
      //  schema: S_ITEM,
      //  failAction: 'error'
      //}
    },
    handler: async (request, h) => {
      const { id } = request.params;

      const { value, error } = await async_unwrap(
        db
          .delete(items)
          .where(eq(items.id, Number(id)))
          .returning()
      )

      if (error) {
        return boom_internal(error)
      }


      console.log('PRE CHECK')

      if (value.length === 0) {
        return boom_not_found('Item not found')
      }

      if (value.length > 0) {
        return h.response().code(204)
      }

    },
  });

}
