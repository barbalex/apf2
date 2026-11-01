/**
 * "apId" -> "ap_id", "statusUnklar" -> "status_unklar", "wgs84Lat" ->
 * "wgs84_lat" (digits do not open a new segment, unlike lodash-style
 * snakeCase). Mirrors apflora.camel_to_snake in the database.
 */
export const camelToSnake = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
