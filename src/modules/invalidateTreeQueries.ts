import { upperFirst } from 'es-toolkit'
import type { QueryClient } from '@tanstack/react-query'

/**
 * invalidates the nav-tree queries affected by a change (delete,
 * restore) of a dataset in the given table
 */
export const invalidateTreeQueries = ({
  tsQueryClient,
  table,
  parentTable,
}: {
  tsQueryClient: QueryClient
  table: string
  parentTable?: string | null | undefined
}) => {
  if (['user', 'message', 'currentissue'].includes(table)) {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }

  const queryKeyTable =
    parentTable === 'tpopfeldkontr' ? 'treeTpopfeldkontr'
    : parentTable === 'tpopfreiwkontr' ? 'treeTpopfreiwkontr'
    : table === 'tpop_apberrelevant_grund_werte' ?
      'treeTpopApberrelevantGrundWerte'
    : table === 'ek_abrechnungstyp_werte' ? 'treeEkAbrechnungstypWerte'
    : table === 'tpopkontrzaehl_einheit_werte' ?
      'treeTpopkontrzaehlEinheitWerte'
    : `tree${upperFirst(table)}`
  void tsQueryClient.invalidateQueries({
    queryKey: [queryKeyTable],
  })

  // folder labels and counts live in the list queries themselves —
  // only these two tables have folder queries of their own
  if (['apberuebersicht'].includes(table)) {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }
  if (table === 'ziel') {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeZiel'] })
  }

  // the parent's data query holds the counts shown in its label,
  // e.g. the ap node shows "Populationen (12/34)"
  if (parentTable) {
    void tsQueryClient.invalidateQueries({
      queryKey: [`tree${upperFirst(parentTable)}`],
    })
  }

  if (table === 'ziel') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
  }
  if (parentTable === 'tpopfeldkontr') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
  }
}
