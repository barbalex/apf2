// source: https://stackoverflow.com/a/8511350/712005

export const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && !Array.isArray(val) && val !== null
