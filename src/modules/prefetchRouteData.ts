// Prefetch data for a route before navigating to it. Every route maps to
// the same queryOptions factory its form uses — form and prefetch share
// the queryKey AND the queryFn (the former Apollo document imports are
// gone).
// The form modules are imported dynamically: this module sits in the
// eager boot graph (via the AppBar's home menu), and static imports
// would drag every form — and with them the map, markdown and select
// stacks — into the initial page load. The chunk loads on the first
// hover of a link of that type, which is exactly when it is needed.
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
  getQueryConfig: (
    params: Record<string, string>,
  ) => Promise<QueryOptionsShape>
}

// Route patterns mapped to their form's queryOptions factory.
// (The old idealbiotop and apberuebersicht configs never matched a real
// route and used keys no form reads — dropped.)
const routeConfigs: RouteConfig[] = [
  // Art
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/([^/]+)$/,
    extractParams: (match) => ({ apId: match[1] ?? '' }),
    getQueryConfig: async ({ apId }) => {
      const { apQueryOptions } = await import(
        '../components/Projekte/Daten/Ap/Ap/Ap.tsx'
      )
      return apQueryOptions(apId)
    },
  },
  // Population
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/([^/]+)$/,
    extractParams: (match) => ({ popId: match[1] ?? '' }),
    getQueryConfig: async ({ popId }) => {
      const { popQueryOptions } = await import(
        '../components/Projekte/Daten/Pop/Pop.tsx'
      )
      return popQueryOptions(popId)
    },
  },
  // Teilpopulation
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/([^/]+)$/,
    extractParams: (match) => ({ tpopId: match[1] ?? '' }),
    getQueryConfig: async ({ tpopId }) => {
      const { tpopQueryOptions } = await import(
        '../components/Projekte/Daten/Tpop/Tpop.tsx'
      )
      return tpopQueryOptions(tpopId)
    },
  },
  // Teilpopulations-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Kontroll-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ tpopberId: match[1] ?? '' }),
    getQueryConfig: async ({ tpopberId }) => {
      const { tpopberQueryOptions } = await import(
        '../components/Projekte/Daten/Tpopber/index.tsx'
      )
      return tpopberQueryOptions(tpopberId)
    },
  },
  // Teilpopulations-Massnahme
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Massnahmen\/([^/]+)$/,
    extractParams: (match) => ({ tpopmassnId: match[1] ?? '' }),
    getQueryConfig: async ({ tpopmassnId }) => {
      const { tpopmassnQueryOptions } = await import(
        '../components/Projekte/Daten/Tpopmassn/Tpopmassn.tsx'
      )
      return tpopmassnQueryOptions(tpopmassnId)
    },
  },
  // Teilpopulations-Massnahmen-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Massnahmen-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ tpopmassnberId: match[1] ?? '' }),
    getQueryConfig: async ({ tpopmassnberId }) => {
      const { tpopmassnberQueryOptions } = await import(
        '../components/Projekte/Daten/Tpopmassnber/index.tsx'
      )
      return tpopmassnberQueryOptions(tpopmassnberId)
    },
  },
  // Feld-Kontrolle
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Feld-Kontrollen\/([^/]+)$/,
    extractParams: (match) => ({ tpopkontrId: match[1] ?? '' }),
    getQueryConfig: async ({ tpopkontrId }) => {
      const { tpopfeldkontrQueryOptions } = await import(
        '../components/Projekte/Daten/Tpopfeldkontr/Tpopfeldkontr.tsx'
      )
      return tpopfeldkontrQueryOptions(tpopkontrId)
    },
  },
  // Freiwilligen-Kontrolle
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Freiwilligen-Kontrollen\/([^/]+)$/,
    extractParams: (match) => ({ tpopkontrId: match[1] ?? '' }),
    getQueryConfig: async ({ tpopkontrId }) => {
      const { tpopfreiwkontrQueryOptions } = await import(
        '../components/Projekte/Daten/Tpopfreiwkontr/Tpopfreiwkontr.tsx'
      )
      return tpopfreiwkontrQueryOptions(tpopkontrId)
    },
  },
  // Kontrolle-Zählung (the kontr id sits in the parent path segment)
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/(?:Feld|Freiwilligen)-Kontrollen\/([^/]+)\/Zaehlungen\/([^/]+)$/,
    extractParams: (match) => ({
      tpopkontrId: match[1] ?? '',
      tpopkontrzaehlId: match[2] ?? '',
    }),
    getQueryConfig: async ({ tpopkontrzaehlId, tpopkontrId }) => {
      const { tpopkontrzaehlQueryOptions } = await import(
        '../components/Projekte/Daten/Tpopkontrzaehl/index.tsx'
      )
      return tpopkontrzaehlQueryOptions(tpopkontrzaehlId, tpopkontrId)
    },
  },
  // AP-Bericht
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ apberId: match[1] ?? '' }),
    getQueryConfig: async ({ apberId }) => {
      const { apberQueryOptions } = await import(
        '../components/Projekte/Daten/Apber/index.tsx'
      )
      return apberQueryOptions(apberId)
    },
  },
  // Populations-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Kontroll-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ popberId: match[1] ?? '' }),
    getQueryConfig: async ({ popberId }) => {
      const { popberQueryOptions } = await import(
        '../components/Projekte/Daten/Popber/index.tsx'
      )
      return popberQueryOptions(popberId)
    },
  },
  // Populations-Massnahmen-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Massnahmen-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ popmassnberId: match[1] ?? '' }),
    getQueryConfig: async ({ popmassnberId }) => {
      const { popmassnberQueryOptions } = await import(
        '../components/Projekte/Daten/Popmassnber/index.tsx'
      )
      return popmassnberQueryOptions(popmassnberId)
    },
  },
  // Art Taxonomie (Apart)
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Taxonomie\/([^/]+)$/,
    extractParams: (match) => ({ apartId: match[1] ?? '' }),
    getQueryConfig: async ({ apartId }) => {
      const { apartQueryOptions } = await import(
        '../components/Projekte/Daten/Apart/index.tsx'
      )
      return apartQueryOptions(apartId)
    },
  },
  // Adresse
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Adressen\/([^/]+)$/,
    extractParams: (match) => ({ adresseId: match[1] ?? '' }),
    getQueryConfig: async ({ adresseId }) => {
      const { adresseQueryOptions } = await import(
        '../components/Projekte/Daten/Adresse/index.tsx'
      )
      return adresseQueryOptions(adresseId)
    },
  },
  // EK Zähleinheit
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/EK-Zähleinheiten\/([^/]+)$/,
    extractParams: (match) => ({ ekzaehleinheitId: match[1] ?? '' }),
    getQueryConfig: async ({ ekzaehleinheitId }) => {
      const { ekzaehleinheitQueryOptions } = await import(
        '../components/Projekte/Daten/Ekzaehleinheit/index.tsx'
      )
      return ekzaehleinheitQueryOptions(ekzaehleinheitId)
    },
  },
  // User
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Benutzer\/([^/]+)$/,
    extractParams: (match) => ({ userId: match[1] ?? '' }),
    getQueryConfig: async ({ userId }) => {
      const { userQueryOptions } = await import(
        '../components/Projekte/Daten/User/index.tsx'
      )
      return userQueryOptions(userId)
    },
  },
  // Erfolgskriterium
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Erfolgskriterien\/([^/]+)$/,
    extractParams: (match) => ({ erfkritId: match[1] ?? '' }),
    getQueryConfig: async ({ erfkritId }) => {
      const { erfkritQueryOptions } = await import(
        '../components/Projekte/Daten/Erfkrit/index.tsx'
      )
      return erfkritQueryOptions(erfkritId)
    },
  },
  // Ziel
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Ziele\/\d+\/([^/]+)$/,
    extractParams: (match) => ({ zielId: match[1] ?? '' }),
    getQueryConfig: async ({ zielId }) => {
      const { zielQueryOptions } = await import(
        '../components/Projekte/Daten/Ziel/Ziel.tsx'
      )
      return zielQueryOptions(zielId)
    },
  },
  // Assoziierte Art
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/assoziierte-Arten\/([^/]+)$/,
    extractParams: (match) => ({ assozartId: match[1] ?? '' }),
    getQueryConfig: async ({ assozartId }) => {
      const { assozartQueryOptions } = await import(
        '../components/Projekte/Daten/Assozart/index.tsx'
      )
      return assozartQueryOptions(assozartId)
    },
  },
  // Projekt
  {
    pattern: /\/Daten\/Projekte\/([^/]+)$/,
    extractParams: (match) => ({ projektId: match[1] ?? '' }),
    getQueryConfig: async ({ projektId }) => {
      const { projektQueryOptions } = await import(
        '../components/Projekte/Daten/Projekt/Projekt.tsx'
      )
      return projektQueryOptions(projektId)
    },
  },
  // Beobachtung nicht zuzuordnen
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/nicht-zuzuordnende-Beobachtungen\/([^/]+)$/,
    extractParams: (match) => ({ beobId: match[1] ?? '' }),
    getQueryConfig: async ({ beobId }) => {
      const { beobQueryOptions } = await import(
        '../components/Projekte/Daten/Beob/index.tsx'
      )
      return beobQueryOptions(beobId)
    },
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
        const options = await config.getQueryConfig(params)

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
