import { gql as dynamicGql } from '../../../apolloGql.ts'
import { graphql } from '../../../gql/index.ts'
import { upperFirst } from 'es-toolkit'
import { camelCase } from 'es-toolkit'

import { tables } from '../../../modules/tables.ts'
import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  navigateAtom,
  userNameAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  type Notification,
} from '../../../store/index.ts'
import {
  adresse as adresseFragment,
  user as userFragment,
  tpopApberrelevantGrundWerte as tpopApberrelevantGrundWerteFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
  ekAbrechnungstypWerte as ekAbrechnungstypWerteFragment,
} from '../../shared/fragments.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

const fragments = {
  tpopApberrelevantGrundWerte: tpopApberrelevantGrundWerteFragment,
  tpopkontrzaehlEinheitWerte: tpopkontrzaehlEinheitWerteFragment,
  ekAbrechnungstypWerte: ekAbrechnungstypWerteFragment,
}

// data of the dynamically built create mutations
type CreateMutationData = Record<
  string,
  Record<string, Record<string, string>> | undefined
>

export const insertDataset = async ({
  tablePassed,
  parentId,
  menuType,
  singleElementUrlName: singleElementName,
  url,
  search,
  jahr: jahrPassed,
}: {
  tablePassed: string
  parentId?: string | null | undefined
  menuType: string
  singleElementUrlName?: string | null | undefined
  url: (string | number)[]
  search: string
  jahr?: string | null | undefined
}) => {
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
  const openNodes = store.get(treeOpenNodesAtom)
  let table = tablePassed
  // insert new dataset in db and fetch id
  const tableMetadata = tables.find((t) => t.table === table)
  const parentTable = tableMetadata?.parentTable
  if (!tableMetadata) {
    return addNotification({
      message: `no table meta data found for table "${table}"`,
      options: {
        variant: 'error',
      },
    })
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }
  const parentIdField = camelCase(tableMetadata.parentIdField ?? '')
  const idField = tableMetadata.idField
  if (!idField) {
    return addNotification({
      message: 'new dataset not created as no idField could be found',
      options: {
        variant: 'error',
      },
    })
  }
  let mutation = dynamicGql`
    mutation createWerte(
      $parentId: UUID!
    ) {
      create${upperFirst(camelCase(table))} (
        input: {
          ${camelCase(table)}: {
            ${parentIdField}: $parentId
          }
        }
      ) {
      ${camelCase(table)} {
        id
        ${parentIdField}
      }
    }
  }`
  let variables: {
    parentId?: string | null | undefined
    jahr?: number | undefined
    role?: string | undefined
  } = { parentId }

  // console.log('insertDataset:', {
  //   table,
  //   parentId,
  //   id,
  //   menuType,
  //   url,
  //   tableMetadata,
  // })
  if (menuType === 'zieljahrFolder') {
    mutation = dynamicGql`
      mutation create${upperFirst(camelCase(table))}(
        $parentId: UUID!
        $jahr: Int
      ) {
        create${upperFirst(camelCase(table))} (
          input: {
            ${camelCase(table)}: {
              ${parentIdField}: $parentId
              jahr: $jahr
            }
          }
        ) {
        ${camelCase(table)} {
          id
          ${parentIdField}
        }
      }
    }`
    variables = { parentId, jahr: Number(jahrPassed) }
  }
  if (menuType === 'tpopfreiwkontrFolder') {
    mutation = dynamicGql`
      mutation create${upperFirst(camelCase(table))}(
        $parentId: UUID!
      ) {
        create${upperFirst(camelCase(table))} (
          input: {
            ${camelCase(table)}: {
              ${parentIdField}: $parentId
              typ: "Freiwilligen-Kontrolle"
            }
          }
        ) {
        ${camelCase(table)} {
          id
          ${parentIdField}
        }
      }
    }`
  }
  if (['tpopfeldkontrFolder', 'tpopfeldkontr'].includes(menuType)) {
    mutation = dynamicGql`
      mutation create${upperFirst(camelCase(table))}(
        $parentId: UUID!
      ) {
        create${upperFirst(camelCase(table))} (
          input: {
            ${camelCase(table)}: {
              ${parentIdField}: $parentId
              typ: "Kontrolle"
            }
          }
        ) {
        ${camelCase(table)} {
          id
          ${parentIdField}
        }
      }
    }`
  }
  if (['userFolder', 'user'].includes(menuType)) {
    mutation = dynamicGql`
      mutation createUser($role: String!) {
        createUser(input: { user: { role: $role } }) {
          user {
            ...UserFields
          }
        }
      }
      ${userFragment}
    `
    delete variables.parentId
    variables.role = 'apflora_ap_reader'
  }
  if (['adresseFolder', 'adresse'].includes(menuType)) {
    mutation = dynamicGql`
      mutation createAdresse {
        createAdresse(input: { adresse: {} }) {
          adresse {
            ...AdresseFields
          }
        }
      }
      ${adresseFragment}
    `
    delete variables.parentId
  }
  if (menuType.includes('Werte')) {
    const tableName = camelCase(table)
    const fields = `${upperFirst(tableName)}Fields`
    mutation = dynamicGql`
      mutation createWerte {
        create${upperFirst(tableName)}(input: { ${tableName}: {
          changedBy: "${store.get(userNameAtom)}"
        } }) {
          ${tableName} {
            ...${fields}
          }
        }
      }
      ${fragments[tableName as keyof typeof fragments]}
    `
    delete variables.parentId
  }

  let result: { data?: CreateMutationData | null | undefined } | undefined
  try {
    if (Object.keys(variables).length) {
      result = await apolloClient.mutate<CreateMutationData>({
        mutation,
        variables,
      })
    } else {
      result = await apolloClient.mutate<CreateMutationData>({ mutation })
    }
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const row =
    result?.data?.[`create${upperFirst(camelCase(table))}`]?.[camelCase(table)]
  const rowId = row?.[idField] ?? ''
  // set new url
  const newActiveNodeArray = [...url, rowId]
  // need to add single name to the url, i.e. 'Art' for ap
  const to = `/Daten/${newActiveNodeArray.join('/')}${singleElementName ? `/${singleElementName}` : ''}${search}`
  setTimeout(() => navigate?.(to), 300)
  // set open nodes
  let newOpenNodes = [...openNodes, newActiveNodeArray]
  if (['zielFolder', 'zieljahrFolder'].includes(menuType)) {
    const urlWithoutJahr = url.toSpliced(-1)
    newOpenNodes = [...openNodes, urlWithoutJahr, newActiveNodeArray]
  }
  if (['tpopfeldkontr', 'tpopfeldkontrFolder'].includes(menuType)) {
    // 1. add new zaehlung
    const result = await apolloClient.mutate({
      mutation: graphql(`
        mutation createWerte($parentId: UUID!) {
          createTpopkontrzaehl(
            input: { tpopkontrzaehl: { tpopkontrId: $parentId } }
          ) {
            tpopkontrzaehl {
              id
            }
          }
        }
      `),
      variables: { parentId: rowId },
    })
    // 2. open the zaehlungFolder
    const zaehlId = result?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id ?? ''
    const newOpenFolder = [...newActiveNodeArray, 'Zaehlungen']
    const newOpenNode = [...newActiveNodeArray, 'Zaehlungen', zaehlId]
    newOpenNodes = [...newOpenNodes, newOpenFolder, newOpenNode]
  }
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  // console.log('insertDataset', { table, parentTable })
  // invalidate tree queries for count and data
  if (['user', 'message', 'currentissue'].includes(table)) {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }
  const queryKeyTable =
    parentTable === 'tpopfeldkontr' ? 'treeTpopfeldkontrzaehl'
    : parentTable === 'tpopfreiwkontr' ? 'treeTpopfreiwkontrzaehl'
    : menuType.includes('tpopfeldkontr') ? 'treeTpopfeldkontr'
    : menuType.includes('tpopfreiwkontr') ? 'treeTpopfreiwkontr'
    : table === 'tpop_apberrelevant_grund_werte' ?
      'treeTpopApberrelevantGrundWerte'
    : table === 'ek_abrechnungstyp_werte' ? 'treeEkAbrechnungstypWerte'
    : table === 'tpopkontrzaehl_einheit_werte' ? 'treePopkontrzaehlEinheitWerte'
    : `tree${upperFirst(table)}`
  void tsQueryClient.invalidateQueries({
    queryKey: [queryKeyTable],
  })
  // console.log('insertDataset', {
  //   table,
  //   parentTable,
  //   menuType,
  //   queryKeyTable,
  // })
  const queryKeyFolder =
    ['apberuebersicht'].includes(table) ? 'treeRoot'
    : table === 'ziel' ? 'treeZiel'
    : parentTable === 'tpopfeldkontr' ? 'treeTpopfeldkontrzaehlFolders'
    : parentTable === 'tpopfreiwkontr' ? 'treeTpopfreiwkontrzaehlFolders'
    : (
      [
        'adresse',
        'tpop_apberrelevant_grund_werte',
        'ek_abrechnungstyp_werte',
        'tpopkontrzaehl_einheit_werte',
      ].includes(table)
    ) ?
      'treeWerteFolders'
    : `tree${upperFirst(parentTable ?? '')}Folders`
  // console.log('insertDataset', {
  //   table,
  //   parentTable,
  //   menuType,
  //   queryKeyFoldersTable: queryKeyFolder,
  //   queryKeyTable,
  //   queryKeyFolder,
  // })
  void tsQueryClient.invalidateQueries({
    queryKey: [queryKeyFolder],
  })
  // also invalidate parent queries for folder counts
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeAp`],
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
  if (['tpopfeldkontr', 'tpopfeldkontrFolder'].includes(menuType)) {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
}
