// regenerates src/modules/selects.ts from the field lists of
// src/components/shared/fragments.ts. Run after changing fragments:
//   npm run selects:generate
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('src/components/shared/fragments.ts', 'utf8')
const chunks = src.split('export const ').slice(1)

// computed columns provided by the v_<table> views
const computedMap = {
  label: 'label',
  labelEk: 'label_ek',
  labelEkf: 'label_ekf',
  lv95X: 'lv95_x',
  lv95Y: 'lv95_y',
  wgs84Lat: 'wgs84_lat',
  wgs84Long: 'wgs84_long',
}

// app table names that differ from the db table names
const tableAlias = {
  currentIssue: 'currentissue',
  tpopfeldkontr: 'tpopkontr',
  tpopfreiwkontr: 'tpopkontr',
}

const snake = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()

const header = `/**
 * PostgREST select strings per table, generated from the field lists of
 * src/components/shared/fragments.ts (npm run selects:generate).
 * camelCase keys keep the client types valid; computed columns (label,
 * coordinate transforms) come from the v_<table> views
 * (sql/postgrest/createComputedViews.sql).
 * Relation fields of the fragments are not included — embed them
 * explicitly where needed: tpop(pop_id,nr), pop_status_werte(code,text).
 */
`

const out = [header]
for (const chunk of chunks) {
  const m = chunk.match(/^(\w+) = graphql\(`\n  fragment \w+ on (\w+) \{\n/)
  if (!m) continue
  const fragName = m[1]
  const tableCc = m[2]
  const end = chunk.indexOf('`', chunk.indexOf('fragment'))
  const body = chunk.slice(m[0].length, chunk.lastIndexOf('}', 0, end))
  // drop nested relation blocks (xByY { ... }) — keep only top-level scalars
  const rawLines = body.split('\n').map((l) => l.trim())
  const lines = []
  let depth = 0
  for (const l of rawLines) {
    if (!l || l.startsWith('#')) continue
    if (depth === 0) {
      if (l.endsWith('{')) {
        depth++
        continue
      }
      lines.push(l.replace(/,$/, ''))
    } else {
      depth += (l.match(/\{/g) || []).length
      depth -= (l.match(/\}/g) || []).length
    }
  }
  const selects = []
  const seen = new Set()
  for (const f of lines) {
    if (seen.has(f)) continue
    // skip PostGraphile relation fields (xByY naming) and the nested
    // geomPoint sub-fields (geojson/x/y); geometry is selected as
    // geomPoint:geom_point (a GeoJSON object)
    if (/^[a-z][a-zA-Z0-9]*By[A-Z]/.test(f)) continue
    if (['geojson', 'x', 'y'].includes(f)) continue
    let entry
    if (f in computedMap) {
      entry = computedMap[f] === f ? f : `${f}:${computedMap[f]}`
    } else if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(f)) {
      const s = snake(f)
      entry = s === f ? f : `${f}:${s}`
    } else {
      continue
    }
    if (!selects.includes(entry)) {
      selects.push(entry)
      seen.add(f)
    }
  }
  // geometry columns
  const dbTable = tableAlias[tableCc] ?? snake(tableCc)
  if (['pop', 'tpop', 'beob', 'pop_history', 'tpop_history'].includes(dbTable)) {
    selects.push('geomPoint:geom_point')
  }
  if (!selects.length) continue
  const varName = fragName + 'Select'
  out.push(`export const ${varName} = '${selects.join(',')}'`)
}

writeFileSync('src/modules/selects.ts', out.join('\n') + '\n')
console.log(`selects.ts regenerated (${out.length - 1} tables)`)
