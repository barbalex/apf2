// Prefetch data for a route before navigating to it. Every route maps to
// the same queryOptions factory its form uses — form and prefetch share
// the queryKey AND the queryFn (the former Apollo document imports are
// gone).
import { apQueryOptions } from '../components/Projekte/Daten/Ap/Ap/Ap.tsx'
import { popQueryOptions } from '../components/Projekte/Daten/Pop/Pop.tsx'
import { tpopQueryOptions } from '../components/Projekte/Daten/Tpop/Tpop.tsx'
import { tpopberQueryOptions } from '../components/Projekte/Daten/Tpopber/index.tsx'
import { tpopmassnQueryOptions } from '../components/Projekte/Daten/Tpopmassn/Tpopmassn.tsx'
import { tpopmassnberQueryOptions } from '../components/Projekte/Daten/Tpopmassnber/index.tsx'
import { tpopfeldkontrQueryOptions } from '../components/Projekte/Daten/Tpopfeldkontr/Tpopfeldkontr.tsx'
import { tpopfreiwkontrQueryOptions } from '../components/Projekte/Daten/Tpopfreiwkontr/Tpopfreiwkontr.tsx'
import { tpopkontrzaehlQueryOptions } from '../components/Projekte/Daten/Tpopkontrzaehl/index.tsx'
import { apberQueryOptions } from '../components/Projekte/Daten/Apber/index.tsx'
import { popberQueryOptions } from '../components/Projekte/Daten/Popber/index.tsx'
import { popmassnberQueryOptions } from '../components/Projekte/Daten/Popmassnber/index.tsx'
import { apartQueryOptions } from '../components/Projekte/Daten/Apart/index.tsx'
import { adresseQueryOptions } from '../components/Projekte/Daten/Adresse/index.tsx'
import { ekzaehleinheitQueryOptions } from '../components/Projekte/Daten/Ekzaehleinheit/index.tsx'
import { userQueryOptions } from '../components/Projekte/Daten/User/index.tsx'
import { erfkritQueryOptions } from '../components/Projekte/Daten/Erfkrit/index.tsx'
import { zielQueryOptions } from '../components/Projekte/Daten/Ziel/Ziel.tsx'
import { assozartQueryOptions } from '../components/Projekte/Daten/Assozart/index.tsx'
import { projektQueryOptions } from '../components/Projekte/Daten/Projekt/Projekt.tsx'
import { beobQueryOptions } from '../components/Projekte/Daten/Beob/index.tsx'

import { getTsQueryClientFromStore } from '../store/index.ts'

interface QueryOptionsShape {
  queryKey: readonly unknown[]
  queryFn: () => Promise<unknown>
}

interface RouteConfig {
  // Pattern to match the route path
  pattern: RegExp
  // Extract params from the path match
  extractParams: (match: RegExpMatchArray) => Record<string, string>
  // Get query configuration
  getQueryConfig: (params: Record<string, string>) => QueryOptionsShape
}

// Route patterns mapped to their form's queryOptions factory.
// (The old idealbiotop and apberuebersicht configs never matched a real
// route and used keys no form reads — dropped.)
const routeConfigs: RouteConfig[] = [
  // Art
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/([^/]+)$/,
    extractParams: (match) => ({ apId: match[1] ?? '' }),
    getQueryConfig: ({ apId }) => apQueryOptions(apId),
  },
  // Population
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/([^/]+)$/,
    extractParams: (match) => ({ popId: match[1] ?? '' }),
    getQueryConfig: ({ popId }) => popQueryOptions(popId),
  },
  // Teilpopulation
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/([^/]+)$/,
    extractParams: (match) => ({ tpopId: match[1] ?? '' }),
    getQueryConfig: ({ tpopId }) => tpopQueryOptions(tpopId),
  },
  // Teilpopulations-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Kontroll-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ tpopberId: match[1] ?? '' }),
    getQueryConfig: ({ tpopberId }) => tpopberQueryOptions(tpopberId),
  },
  // Teilpopulations-Massnahme
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Massnahmen\/([^/]+)$/,
    extractParams: (match) => ({ tpopmassnId: match[1] ?? '' }),
    getQueryConfig: ({ tpopmassnId }) => tpopmassnQueryOptions(tpopmassnId),
  },
  // Teilpopulations-Massnahmen-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Massnahmen-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ tpopmassnberId: match[1] ?? '' }),
    getQueryConfig: ({ tpopmassnberId }) =>
      tpopmassnberQueryOptions(tpopmassnberId),
  },
  // Feld-Kontrolle
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Feld-Kontrollen\/([^/]+)$/,
    extractParams: (match) => ({ tpopkontrId: match[1] ?? '' }),
    getQueryConfig: ({ tpopkontrId }) => tpopfeldkontrQueryOptions(tpopkontrId),
  },
  // Freiwilligen-Kontrolle
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Freiwilligen-Kontrollen\/([^/]+)$/,
    extractParams: (match) => ({ tpopkontrId: match[1] ?? '' }),
    getQueryConfig: ({ tpopkontrId }) =>
      tpopfreiwkontrQueryOptions(tpopkontrId),
  },
  // Kontrolle-Zählung (the kontr id sits in the parent path segment)
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/(?:Feld|Freiwilligen)-Kontrollen\/([^/]+)\/Zaehlungen\/([^/]+)$/,
    extractParams: (match) => ({
      tpopkontrId: match[1] ?? '',
      tpopkontrzaehlId: match[2] ?? '',
    }),
    getQueryConfig: ({ tpopkontrzaehlId, tpopkontrId }) =>
      tpopkontrzaehlQueryOptions(tpopkontrzaehlId, tpopkontrId),
  },
  // AP-Bericht
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ apberId: match[1] ?? '' }),
    getQueryConfig: ({ apberId }) => apberQueryOptions(apberId),
  },
  // Populations-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Kontroll-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ popberId: match[1] ?? '' }),
    getQueryConfig: ({ popberId }) => popberQueryOptions(popberId),
  },
  // Populations-Massnahmen-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Massnahmen-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ popmassnberId: match[1] ?? '' }),
    getQueryConfig: ({ popmassnberId }) =>
      popmassnberQueryOptions(popmassnberId),
  },
  // Art Taxonomie (Apart)
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Taxonomie\/([^/]+)$/,
    extractParams: (match) => ({ apartId: match[1] ?? '' }),
    getQueryConfig: ({ apartId }) => apartQueryOptions(apartId),
  },
  // Adresse
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Adressen\/([^/]+)$/,
    extractParams: (match) => ({ adresseId: match[1] ?? '' }),
    getQueryConfig: ({ adresseId }) => adresseQueryOptions(adresseId),
  },
  // EK Zähleinheit
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/EK-Zähleinheiten\/([^/]+)$/,
    extractParams: (match) => ({ ekzaehleinheitId: match[1] ?? '' }),
    getQueryConfig: ({ ekzaehleinheitId }) =>
      ekzaehleinheitQueryOptions(ekzaehleinheitId),
  },
  // User
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Benutzer\/([^/]+)$/,
    extractParams: (match) => ({ userId: match[1] ?? '' }),
    getQueryConfig: ({ userId }) => userQueryOptions(userId),
  },
  // Erfolgskriterium
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Erfolgskriterien\/([^/]+)$/,
    extractParams: (match) => ({ erfkritId: match[1] ?? '' }),
    getQueryConfig: ({ erfkritId }) => erfkritQueryOptions(erfkritId),
  },
  // Ziel
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Ziele\/\d+\/([^/]+)$/,
    extractParams: (match) => ({ zielId: match[1] ?? '' }),
    getQueryConfig: ({ zielId }) => zielQueryOptions(zielId),
  },
  // Assoziierte Art
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/assoziierte-Arten\/([^/]+)$/,
    extractParams: (match) => ({ assozartId: match[1] ?? '' }),
    getQueryConfig: ({ assozartId }) => assozartQueryOptions(assozartId),
  },
  // Projekt
  {
    pattern: /\/Daten\/Projekte\/([^/]+)$/,
    extractParams: (match) => ({ projektId: match[1] ?? '' }),
    getQueryConfig: ({ projektId }) => projektQueryOptions(projektId),
  },
  // Beobachtung nicht zuzuordnen
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/nicht-zuzuordnende-Beobachtungen\/([^/]+)$/,
    extractParams: (match) => ({ beobId: match[1] ?? '' }),
    getQueryConfig: ({ beobId }) => beobQueryOptions(beobId),
  },
]

/**
 * Prefetch data for a route before navigating to it
 * @param path - The route path to prefetch data for
 */
export const prefetchRouteData = async (path: string) => {
  const tsQueryClient = getTsQueryClientFromStore()
  if (!tsQueryClient) return

  // strip search and hash: callers pass navigation urls like
  // `/Daten/Projekte/<id>?projekteTabs=tree&...`; the query string
  // must not end up inside an id (#824)
  const pathWithoutSearch = path.split('?')[0]?.split('#')[0] ?? path
  // Decode the path to handle URL-encoded characters
  const decodedPath = decodeURIComponent(pathWithoutSearch)

  // Find matching route config
  for (const config of routeConfigs) {
    const match = decodedPath.match(config.pattern)
    if (match) {
      try {
        const params = config.extractParams(match)
        const options = config.getQueryConfig(params)

        // Check if data is already in cache
        const cachedData = tsQueryClient.getQueryData(options.queryKey)
        if (cachedData) {
          return
        }

        // Prefetch the data
        await tsQueryClient.prefetchQuery(options)

        return
      } catch (error) {
        console.error('Error prefetching route data:', error)
      }
    }
  }
}
