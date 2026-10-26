import type id from "./id";

/** Bentuk dictionary = bentuk dictionaries/id.ts, dengan semua teks bertipe string biasa. */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof id>;
