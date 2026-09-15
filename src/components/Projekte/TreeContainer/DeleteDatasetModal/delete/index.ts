import { isEqual } from 'es-toolkit'
import { upperFirst } from 'es-toolkit'
import { camelCase } from 'es-toolkit'
import { omit } from 'es-toolkit'
import { gql as dynamicGql } from '../../../../../apolloGql.ts'

import { tables } from '../../../../../modules/tables.ts'
import {
  store,
  tsQueryClientAtom,
  apolloClientAtom,
  addNotificationAtom,
  navigateAtom,
  toDeleteAtom,
  emptyToDeleteAtom,
  addDeletedDatasetAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
  type Notification,
  type DeletedDataset,
} from '../../../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

const isFreiwilligenKontrolle = (activeNodeArray: (string | number)[]) =>
  activeNodeArray[activeNodeArray.length - 2] === 'Freiwilligen-Kontrollen'

export const deleteModule = async ({ search }: { search: string }) => {
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)
  if (!apolloClient) {
    return addNotification({
      message: 'no apollo client found in store',
      options: {
        variant: 'error',
      },
    })
  }
  if (!tsQueryClient) {
    return addNotification({
      message: 'no query client found in store',
      options: {
        variant: 'error',
      },
    })
  }
  const navigate = store.get(navigateAtom)
  const toDelete = store.get(toDeleteAtom)

  // some tables need to be translated, i.e. tpopfreiwkontr
  const tableMetadata = tables.find((t) => t.table === toDelete.table)
  const parentTable = tableMetadata?.parentTable
  if (!tableMetadata) {
    return addNotification({
      message: `Error in action deleteDatasetDemand: no table meta data found for table "${toDelete.table}"`,
      options: {
        variant: 'error',
      },
    })
  }
  // tableMetadata.table === toDelete.table is guaranteed by the find above
  const table = tableMetadata.dbTable ? tableMetadata.dbTable : tableMetadata.table
  // console.log('deleteModule', { tableMetadata, table, parentTable })

  /**
   * fetch data for dataset
   * then add it to deletedDatasets
   */
  const isWerte = table.toLowerCase().includes('werte')
  const tableName = camelCase(table)
  const queryName = `${tableName}ById`
  /**
   * cannot use `./${camelCase(table)}ById`
   * because webpack performs static analysis at build time
   * see: https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
   */
  let query
  if (isWerte) {
    query = dynamicGql`
      query werteById($id: UUID!) {
        ${queryName}(id: $id) {
          id
          code
          text
          sort
          changedBy
        }
      }
    `
  } else {
    const qrObject = await import(`./queries/${queryName}.ts`)
    query = qrObject.default
  }
  let result: Record<string, unknown> | undefined
  try {
    result = await apolloClient.query({
      query,
      variables: { id: toDelete.id },
    })
  } catch (error) {
    console.log(error)
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const resultData = (result?.data ?? {}) as Record<string, unknown>
  let data = {
    ...(resultData[`${tableName}ById`] as Record<string, unknown> | undefined),
  }
  data = omit(data, ['__typename'])

  // add to datasetsDeleted
  // cast: toDelete fields are nullable in the atom
  // but deletion is only possible with a dataset selected
  store.set(
    addDeletedDatasetAtom,
    {
      table,
      id: toDelete.id,
      label: toDelete.label,
      url: toDelete.url,
      data,
      time: Date.now(),
      afterDeletionHook: toDelete.afterDeletionHook,
    } as unknown as DeletedDataset,
  )

  try {
    await apolloClient.mutate({
      mutation: dynamicGql`
        mutation deleteSomething($id: UUID!) {
          delete${upperFirst(camelCase(table))}ById(input: { id: $id }) {
            ${camelCase(table)} {
              id
            }
          }
        }
      `,
      variables: { id: toDelete.id },
    })
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }

  // if tpop was deleted: set beob free
  // not necessary: is done by reference by db
  // BUT: need to refetch tree

  // set new url if necessary
  const activeNodeArray1 = store.get(treeActiveNodeArrayAtom)
  if (
    toDelete.url &&
    isEqual(activeNodeArray1, toDelete.url) &&
    !isFreiwilligenKontrolle(activeNodeArray1)
  ) {
    const newActiveNodeArray1 = [...toDelete.url]
    newActiveNodeArray1.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray1.pop()
    }
    setTimeout(
      () => navigate?.(`/Daten/${newActiveNodeArray1.join('/')}${search}`),
      300,
    )
  }

  // remove from openNodes
  const openNodes = store.get(treeOpenNodesAtom)
  const newOpenNodes = openNodes.filter((n) => !isEqual(n, toDelete.url))
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  // invalidate tree queries for count and data
  if (['user', 'message', 'currentissue'].includes(table)) {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }

  const queryKeyTable =
    parentTable === 'tpopfeldkontr'
      ? 'treeTpopfeldkontr'
      : parentTable === 'tpopfreiwkontr'
        ? 'treeTpopfreiwkontr'
        : table === 'tpop_apberrelevant_grund_werte'
          ? 'treeTpopApberrelevantGrundWerte'
          : table === 'ek_abrechnungstyp_werte'
            ? 'treeEkAbrechnungstypWerte'
            : table === 'tpopkontrzaehl_einheit_werte'
              ? 'treeTpopkontrzaehlEinheitWerte'
              : `tree${upperFirst(table)}`
  void tsQueryClient.invalidateQueries({
    queryKey: [queryKeyTable],
  })
  const queryKeyFolders = ['apberuebersicht'].includes(table)
    ? 'treeRoot'
    : table === 'ziel'
      ? 'treeZiel'
      : parentTable === 'tpopfeldkontr'
        ? 'treeTpopfeldkontrzaehlFolders'
        : parentTable === 'tpopfreiwkontr'
          ? 'treeTpopfreiwkontrzaehlFolders'
          : [
                'adresse',
                'tpop_apberrelevant_grund_werte',
                'ek_abrechnungstyp_werte',
                'tpopkontrzaehl_einheit_werte',
              ].includes(table)
            ? 'treeWerteFolders'
            : `tree${upperFirst(parentTable ?? '')}Folders`
  // console.log('Tree: deleting node', {
  //   queryKeyFoldersTable,parentTable,
  //   queryToInvalidate: `tree${upperFirst(queryKeyFoldersTable)}Folders`,
  // })
  void tsQueryClient.invalidateQueries({
    queryKey: [queryKeyFolders],
  })
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

  if (toDelete.afterDeletionHook) toDelete.afterDeletionHook()

  // reset datasetToDelete
  store.set(emptyToDeleteAtom)
}
