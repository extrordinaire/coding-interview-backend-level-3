
export type wrapped<T> =
  | {
    value: T,
    error: null,
    raw_throw: null,
  }
  | {
    value: null,
    error: Error,
    raw_throw: unknown,
  }

export async function async_unwrap<T>(promise: Promise<T>): Promise<wrapped<T>> {
  try {
    const result = await promise

    return {
      value: result,
      error: null,
      raw_throw: null,
    }
  }
  catch (maybe_error) {

    const error =
      maybe_error instanceof Error ? maybe_error : new Error(String(maybe_error));

    return {
      value: null,
      error: error,
      raw_throw: maybe_error,
    }
  }
}

export function unwrap<T>(protected_call: () => T): wrapped<T> {
  try {
    const result = protected_call()
    return {
      value: result,
      error: null,
      raw_throw: null,
    }
  }
  catch (maybe_error) {
    const error =
      maybe_error instanceof Error ? maybe_error : new Error(String(maybe_error));

    return {
      value: null,
      error: error,
      raw_throw: maybe_error,
    }
  }
}

