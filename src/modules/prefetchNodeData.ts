// Import queries for different node types
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
  store,
  apolloClientAtom,
  tsQueryClientAtom,
} from '../store/index.js'

interface NodeQueryConfig {
  query: any
  queryKey: (id: string, node?: any) => any[]
  variables: (id: string, node?: any) => any
}

// Map menu types to their queries and query keys
const nodeQueryConfigs: Record<string, NodeQueryConfig> = {
  ap: {
    query: apQuery,
    queryKey: (id) => ['ap', id],
    variables: (id) => ({ id }),
  },
  pop: {
    query: popQuery,
    queryKey: (id) => ['pop', id],
    variables: (id) => ({ id }),
  },
  tpop: {
    query: tpopQuery,
    queryKey: (id) => ['tpop', id],
    variables: (id) => ({ id }),
  },
  tpopber: {
    query: tpopberQuery,
    queryKey: (id) => ['tpopber', id],
    variables: (id) => ({ id }),
  },
  tpopmassn: {
    query: tpopmassnQuery,
    queryKey: (id) => ['tpopmassn', id],
    variables: (id) => ({ id }),
  },
  tpopmassnber: {
    query: tpopmassnberQuery,
    queryKey: (id) => ['tpopmassnber', id],
    variables: (id) => ({ id }),
  },
  tpopfeldkontr: {
    query: tpopfeldkontrQuery,
    queryKey: (id) => ['tpopfeldkontr', id],
    variables: (id) => ({ id }),
  },
  tpopfreiwkontr: {
    query: tpopfreiwkontrQuery,
    queryKey: (id) => ['TpopkontrQuery', id],
    variables: (id) => ({ id }),
  },
  tpopkontrzaehl: {
    query: tpopkontrzaehlQuery,
    queryKey: (id) => ['tpopkontrzaehl', id],
    variables: (id) => ({ id }),
  },
  apber: {
    query: apberQuery,
    queryKey: (id) => ['apber', id],
    variables: (id) => ({ id }),
  },
  popber: {
    query: popberQuery,
    queryKey: (id) => ['popber', id],
    variables: (id) => ({ id }),
  },
  popmassnber: {
    query: popmassnberQuery,
    queryKey: (id) => ['popmassnber', id],
    variables: (id) => ({ id }),
  },
  idealbiotop: {
    query: idealbiotopQuery,
    queryKey: (id, node) => ['idealbiotop', node.parentTableId || node.tableId],
    variables: (id, node) => ({ id: node.parentTableId || id }),
  },
  apart: {
    query: apartQuery,
    queryKey: (id) => ['apart', id],
    variables: (id) => ({ id }),
  },
  adresse: {
    query: adresseQuery,
    queryKey: (id) => ['adresse', id],
    variables: (id) => ({ id }),
  },
  ekzaehleinheit: {
    query: ekzaehleinheitQuery,
    queryKey: (id) => ['ekzaehleinheit', id],
    variables: (id) => ({ id }),
  },
  user: {
    query: userQuery,
    queryKey: (id) => ['user', id],
    variables: (id) => ({ id }),
  },
  erfkrit: {
    query: erfkritQuery,
    queryKey: (id) => ['erfkrit', id],
    variables: (id) => ({ id }),
  },
  ziel: {
    query: zielQuery,
    queryKey: (id) => ['ziel', id],
    variables: (id) => ({ id }),
  },
  assozart: {
    query: assozartQuery,
    queryKey: (id) => ['assozart', id],
    variables: (id) => ({ id }),
  },
  projekt: {
    query: projektQuery,
    queryKey: (id) => ['projekt', id],
    variables: (id) => ({ id }),
  },
  beobNichtZuzuordnen: {
    query: beobQuery,
    queryKey: (id) => ['beobNichtZuzuordnen', id],
    variables: (id) => ({ id }),
  },
  apberuebersicht: {
    query: apberuebersichtQuery,
    queryKey: (id) => ['apberuebersicht', id],
    variables: (id) => ({ id }),
  },
}

export const prefetchNodeData = async (node: any) => {
  const { menuType, tableId, id } = node
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)

  // Only prefetch for node types we have queries for
  const config = nodeQueryConfigs[menuType]
  if (!config) return

  const nodeId = tableId || id
  if (!nodeId) return

  if (!tsQueryClient || !apolloClient) return

  // Check if data is already in cache
  const cachedData = tsQueryClient.getQueryData(config.queryKey(nodeId, node))
  if (cachedData) return

  // Prefetch the data
  await tsQueryClient.prefetchQuery({
    queryKey: config.queryKey(nodeId, node),
    queryFn: async () => {
      const result = await apolloClient.query({
        query: config.query,
        variables: config.variables(nodeId, node),
      })
      if (result.error) throw result.error
      return result.data
    },
  })
}
