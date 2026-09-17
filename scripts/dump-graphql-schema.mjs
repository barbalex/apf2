// Dumps the GraphQL SDL from the local PostGraphile backend into graphql/schema.graphql
// Usage: node scripts/dump-graphql-schema.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'

const response = await fetch('http://localhost:5000/graphql', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
})
const { data, errors } = await response.json()
if (!data) {
  console.error('introspection failed:', errors)
  process.exit(1)
}
mkdirSync('graphql', { recursive: true })
writeFileSync('graphql/schema.graphql', printSchema(buildClientSchema(data)))
console.log('graphql/schema.graphql written')
