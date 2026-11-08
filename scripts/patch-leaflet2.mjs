// Leaflet 2 workarounds applied after every install, until upstream ships
// Leaflet 2 support. Idempotent.
//
// 1. @react-leaflet/core's Pane implementation calls DomUtil.addClass/removeClass,
//    which Leaflet 2 removed (they were never in the v2 DomUtil namespace). The
//    map passes className to <Pane> (SafePane/overlays), so replace the calls
//    with the DOM equivalent. Remove once react-leaflet ships Leaflet 2 support.
// 2. react-leaflet's WMSTileLayer instantiates the Leaflet-1 nested class
//    TileLayer.WMS, which Leaflet 2 flattened to WMSTileLayer. Same removal
//    condition as 1.
// 3. leaflet.markercluster's MarkerPatches.d.ts merges an interface onto
//    Leaflet 2's Marker class. Under TypeScript 6 this merge fails in a way
//    that silently drops ALL other 'leaflet' module augmentations from the
//    program — including src/types/leaflet-v1-type-compat.d.ts, which
//    react-leaflet 5's typings need. Replace the file with an empty module;
//    it only adds clusterHide/clusterShow/refreshIconOptions to Marker,
//    which this app never calls. Remove once typescript (or markercluster
//    types) behaves.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const nodeModules = join(root, 'node_modules')

const replacementsPatches = [
  {
    file: join(nodeModules, '@react-leaflet', 'core', 'lib', 'dom.js'),
    replacements: [
      ['DomUtil.addClass(element, cls);', 'element.classList.add(cls);'],
      ['DomUtil.removeClass(element, cls);', 'element.classList.remove(cls);'],
    ],
  },
  {
    file: join(nodeModules, 'react-leaflet', 'lib', 'WMSTileLayer.js'),
    replacements: [
      [
        "import { TileLayer } from 'leaflet';",
        "import { WMSTileLayer as LeafletWMSTileLayer } from 'leaflet';",
      ],
      ['new TileLayer.WMS(url, {', 'new LeafletWMSTileLayer(url, {'],
    ],
  },
]

const markerPatchesFile = join(
  nodeModules,
  'leaflet.markercluster',
  'dist',
  'types',
  'MarkerPatches.d.ts',
)
const markerPatchesReplacement = `// patched by scripts/patch-leaflet2.mjs:
// the interface merge onto Leaflet 2's Marker class breaks other 'leaflet'
// module augmentations under TypeScript 6; this app does not use the
// clusterHide/clusterShow/refreshIconOptions methods it declares
export {}
`

let totalPatched = 0
for (const { file, replacements } of replacementsPatches) {
  let source
  try {
    source = readFileSync(file, 'utf8')
  } catch {
    console.warn(`patch-leaflet2: ${file} not found, skipping`)
    continue
  }

  let patched = 0
  for (const [from, to] of replacements) {
    if (source.includes(to)) continue // already patched
    if (!source.includes(from)) {
      console.warn(`patch-leaflet2: pattern no longer present: ${from}`)
      continue
    }
    source = source.replace(from, to)
    patched++
  }

  if (patched > 0) {
    writeFileSync(file, source)
    totalPatched += patched
    console.log(
      `patch-leaflet2: ${file.replace(root + '/', '')}: replaced ${patched}`,
    )
  }
}

try {
  const markerPatches = readFileSync(markerPatchesFile, 'utf8')
  if (markerPatches.includes('clusterHide')) {
    writeFileSync(markerPatchesFile, markerPatchesReplacement)
    totalPatched++
    console.log(
      `patch-leaflet2: ${markerPatchesFile.replace(root + '/', '')}: neutralized Marker interface merge`,
    )
  }
} catch {
  console.warn(`patch-leaflet2: ${markerPatchesFile} not found, skipping`)
}

if (totalPatched === 0) {
  console.log('patch-leaflet2: already patched')
}
