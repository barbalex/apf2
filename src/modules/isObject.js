// source: https://stackoverflow.com/a/8511350/712005

const isObject = (val) =>
  typeof val === 'object' && !Array.isArray(val) && val !== null

export default isObject
