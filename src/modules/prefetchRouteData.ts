import type { Instance } from 'mobx-state-tree'

// Import queries for different routes
import { query as apQuery } from '../components/Projekte/Daten/Ap/query.ts'
import { query as popQuery } from '../components/Projekte/Daten/Pop/query.ts'
import { query as tpopQuery } from '../components/Projekte/Daten/Tpop/query.ts'
import { query as tpopberQuery } from '../components/Projekte/Daten/Tpopber/query.ts'
import { query as tpopmassnQuery } from '../components/Projekte/Daten/Tpopmassn/query.ts'
import { query as tpopmassnberQuery } from '../components/Projekte/Daten/Tpopmassnber/query.ts'
import { query as tpopfeldkontrQuery } from '../components/Projekte/Daten/Tpopfeldkontr/query.ts'
import { query as tpopfreiwkontrQuery } from '../components/Projekte/Daten/Tpopfreiwkontr/query.ts'
import { query as tpopkontrzaehlQuery } from '../components/Projekte/Daten/Tpopkontrzaehl/query.ts'
import { query as apberQuery } from '../components/Projekte/Daten/Apber/query.ts'
import { query as popberQuery } from '../components/Projekte/Daten/Popber/query.ts'
import { query as popmassnberQuery } from '../components/Projekte/Daten/Popmassnber/query.ts'
import { query as idealbiotopQuery } from '../components/Projekte/Daten/Idealbiotop/query.ts'
import { query as apartQuery } from '../components/Projekte/Daten/Apart/query.ts'
import { query as adresseQuery } from '../components/Projekte/Daten/Adresse/query.ts'
import { query as ekzaehleinheitQuery } from '../components/Projekte/Daten/Ekzaehleinheit/query.ts'
import { query as userQuery } from '../components/Projekte/Daten/User/query.ts'
import { query as erfkritQuery } from '../components/Projekte/Daten/Erfkrit/query.ts'
import { query as zielQuery } from '../components/Projekte/Daten/Ziel/query.ts'
import { query as assozartQuery } from '../components/Projekte/Daten/Assozart/query.ts'
import { query as projektQuery } from '../components/Projekte/Daten/Projekt/query.ts'
import { query as beobQuery } from '../components/Projekte/Daten/Beob/query.ts'
import { query as apberuebersichtQuery } from '../components/Projekte/Daten/Apberuebersicht/query.ts'

import {
  store as jotaiStore,
  apolloClientAtom,
  tsQueryClientAtom,
} from '../JotaiStore/index.ts'

interface RouteConfig {
  // Pattern to match the route path
  pattern: RegExp
  // Extract params from the path match
  extractParams: (match: RegExpMatchArray) => Record<string, string>
  // Get query configuration
  getQueryConfig: (params: Record<string, string>) => {
    query: any
    queryKey: any[]
    variables: any
  }
}

// Route patterns mapped to their query configurations
const routeConfigs: RouteConfig[] = [
  // Art
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/([^/]+)$/,
    extractParams: (match) => ({ apId: match[1] }),
    getQueryConfig: ({ apId }) => ({
      query: apQuery,
      queryKey: ['ap', apId],
      variables: { id: apId },
    }),
  },
  // Population
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/([^/]+)$/,
    extractParams: (match) => ({ popId: match[1] }),
    getQueryConfig: ({ popId }) => ({
      query: popQuery,
      queryKey: ['pop', popId],
      variables: { id: popId },
    }),
  },
  // Teilpopulation
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/([^/]+)$/,
    extractParams: (match) => ({ tpopId: match[1] }),
    getQueryConfig: ({ tpopId }) => ({
      query: tpopQuery,
      queryKey: ['tpop', tpopId],
      variables: { id: tpopId },
    }),
  },
  // Teilpopulations-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Kontroll-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ tpopberId: match[1] }),
    getQueryConfig: ({ tpopberId }) => ({
      query: tpopberQuery,
      queryKey: ['tpopber', tpopberId],
      variables: { id: tpopberId },
    }),
  },
  // Teilpopulations-Massnahme
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Massnahmen\/([^/]+)$/,
    extractParams: (match) => ({ tpopmassnId: match[1] }),
    getQueryConfig: ({ tpopmassnId }) => ({
      query: tpopmassnQuery,
      queryKey: ['tpopmassn', tpopmassnId],
      variables: { id: tpopmassnId },
    }),
  },
  // Teilpopulations-Massnahmen-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Massnahmen-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ tpopmassnberId: match[1] }),
    getQueryConfig: ({ tpopmassnberId }) => ({
      query: tpopmassnberQuery,
      queryKey: ['tpopmassnber', tpopmassnberId],
      variables: { id: tpopmassnberId },
    }),
  },
  // Feld-Kontrolle
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Feld-Kontrollen\/([^/]+)$/,
    extractParams: (match) => ({ tpopkontrId: match[1] }),
    getQueryConfig: ({ tpopkontrId }) => ({
      query: tpopfeldkontrQuery,
      queryKey: ['tpopfeldkontr', tpopkontrId],
      variables: { id: tpopkontrId },
    }),
  },
  // Freiwilligen-Kontrolle
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Freiwilligen-Kontrollen\/([^/]+)$/,
    extractParams: (match) => ({ tpopkontrId: match[1] }),
    getQueryConfig: ({ tpopkontrId }) => ({
      query: tpopfreiwkontrQuery,
      queryKey: ['tpopfreiwkontr', tpopkontrId],
      variables: { id: tpopkontrId },
    }),
  },
  // Kontrolle-Zählung
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/(?:Feld|Freiwilligen)-Kontrollen\/[^/]+\/Zaehlungen\/([^/]+)$/,
    extractParams: (match) => ({ tpopkontrzaehlId: match[1] }),
    getQueryConfig: ({ tpopkontrzaehlId }) => ({
      query: tpopkontrzaehlQuery,
      queryKey: ['tpopkontrzaehl', tpopkontrzaehlId],
      variables: { id: tpopkontrzaehlId },
    }),
  },
  // AP-Bericht
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ apberId: match[1] }),
    getQueryConfig: ({ apberId }) => ({
      query: apberQuery,
      queryKey: ['apber', apberId],
      variables: { id: apberId },
    }),
  },
  // Populations-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Kontroll-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ popberId: match[1] }),
    getQueryConfig: ({ popberId }) => ({
      query: popberQuery,
      queryKey: ['popber', popberId],
      variables: { id: popberId },
    }),
  },
  // Populations-Massnahmen-Bericht
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Massnahmen-Berichte\/([^/]+)$/,
    extractParams: (match) => ({ popmassnberId: match[1] }),
    getQueryConfig: ({ popmassnberId }) => ({
      query: popmassnberQuery,
      queryKey: ['popmassnber', popmassnberId],
      variables: { id: popmassnberId },
    }),
  },
  // Idealbiotop
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Populationen\/[^/]+\/Teil-Populationen\/[^/]+\/Biotop$/,
    extractParams: (match) => {
      // For idealbiotop, we need to extract tpopId from the parent path
      const tpopIdMatch = /\/Teil-Populationen\/([^/]+)\/Biotop$/.exec(match[0])
      return { tpopId: tpopIdMatch?.[1] || '' }
    },
    getQueryConfig: ({ tpopId }) => ({
      query: idealbiotopQuery,
      queryKey: ['idealbiotop', tpopId],
      variables: { tpopId },
    }),
  },
  // Art Taxonomie (Apart)
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/Taxonomie\/([^/]+)$/,
    extractParams: (match) => ({ apartId: match[1] }),
    getQueryConfig: ({ apartId }) => ({
      query: apartQuery,
      queryKey: ['apart', apartId],
      variables: { id: apartId },
    }),
  },
  // Adresse
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Adressen\/([^/]+)$/,
    extractParams: (match) => ({ adresseId: match[1] }),
    getQueryConfig: ({ adresseId }) => ({
      query: adresseQuery,
      queryKey: ['adresse', adresseId],
      variables: { id: adresseId },
    }),
  },
  // EK Zähleinheit
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/EK-Zähleinheiten\/([^/]+)$/,
    extractParams: (match) => ({ ekzaehleinheitId: match[1] }),
    getQueryConfig: ({ ekzaehleinheitId }) => ({
      query: ekzaehleinheitQuery,
      queryKey: ['ekzaehleinheit', ekzaehleinheitId],
      variables: { id: ekzaehleinheitId },
    }),
  },
  // User
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Benutzer\/([^/]+)$/,
    extractParams: (match) => ({ userId: match[1] }),
    getQueryConfig: ({ userId }) => ({
      query: userQuery,
      queryKey: ['user', userId],
      variables: { id: userId },
    }),
  },
  // Erfolgskriterium
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Erfolgskriterien\/([^/]+)$/,
    extractParams: (match) => ({ erfkritId: match[1] }),
    getQueryConfig: ({ erfkritId }) => ({
      query: erfkritQuery,
      queryKey: ['erfkrit', erfkritId],
      variables: { id: erfkritId },
    }),
  },
  // Ziel
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Ziele\/\d+\/([^/]+)$/,
    extractParams: (match) => ({ zielId: match[1] }),
    getQueryConfig: ({ zielId }) => ({
      query: zielQuery,
      queryKey: ['ziel', zielId],
      variables: { id: zielId },
    }),
  },
  // Assoziierte Art
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/assoziierte-Arten\/([^/]+)$/,
    extractParams: (match) => ({ assozartId: match[1] }),
    getQueryConfig: ({ assozartId }) => ({
      query: assozartQuery,
      queryKey: ['assozart', assozartId],
      variables: { id: assozartId },
    }),
  },
  // Projekt
  {
    pattern: /\/Daten\/Projekte\/([^/]+)$/,
    extractParams: (match) => ({ projektId: match[1] }),
    getQueryConfig: ({ projektId }) => ({
      query: projektQuery,
      queryKey: ['projekt', projektId],
      variables: { id: projektId },
    }),
  },
  // Beobachtung nicht zuzuordnen
  {
    pattern:
      /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/nicht-zuzuordnende-Beobachtungen\/([^/]+)$/,
    extractParams: (match) => ({ beobId: match[1] }),
    getQueryConfig: ({ beobId }) => ({
      query: beobQuery,
      queryKey: ['beobNichtZuzuordnen', beobId],
      variables: { id: beobId },
    }),
  },
  // AP-Berichte Übersicht
  {
    pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/[^/]+\/AP-Berichte\/Uebersicht$/,
    extractParams: () => ({}),
    getQueryConfig: () => ({
      query: apberuebersichtQuery,
      queryKey: ['apberuebersicht'],
      variables: {},
    }),
  },
]

/**
 * Prefetch data for a route before navigating to it
 * @param path - The route path to prefetch data for
 */
export const prefetchRouteData = async (path: string) => {
  const tsQueryClient = jotaiStore.get(tsQueryClientAtom)
  const apolloClient = jotaiStore.get(apolloClientAtom)
  if (!tsQueryClient || !apolloClient) return

  // Decode the path to handle URL-encoded characters
  const decodedPath = decodeURIComponent(path)

  // Find matching route config
  for (const config of routeConfigs) {
    const match = decodedPath.match(config.pattern)
    if (match) {
      try {
        const params = config.extractParams(match)
        const { query, queryKey, variables } = config.getQueryConfig(params)

        // Check if data is already in cache
        const cachedData = tsQueryClient.getQueryData(queryKey)
        if (cachedData) {
          return
        }

        // Prefetch the data
        await tsQueryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const result = await apolloClient.query({
              query,
              variables,
            })
            return result.data
          },
        })

        return
      } catch (error) {
        console.error('Error prefetching route data:', error)
      }
    }
  }
}
