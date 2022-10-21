import { gql } from '@apollo/client'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import tables from '../../../modules/tables'
import {
  adresse as adresseFragment,
  user as userFragment,
  // eslint-disable-next-line no-unused-vars
  tpopApberrelevantGrundWerte as tpopApberrelevantGrundWerteFragment,
  // eslint-disable-next-line no-unused-vars
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
  // eslint-disable-next-line no-unused-vars
  ekAbrechnungstypWerte as ekAbrechnungstypWerteFragment,
} from '../../shared/fragments'

const fragments = {
  tpopApberrelevantGrundWerte: tpopApberrelevantGrundWerteFragment,
  tpopkontrzaehlEinheitWerte: tpopkontrzaehlEinheitWerteFragment,
  ekAbrechnungstypWerte: ekAbrechnungstypWerteFragment,
}

const insertDataset = async ({
  treeName,
  tablePassed,
  parentId,
  id,
  menuType,
  url,
  client,
  store,
}) => {
  const { enqueNotification } = store
  const { setActiveNodeArray, openNodes, setOpenNodes } = store[treeName]
  let table = tablePassed
  // insert new dataset in db and fetch id
  const tableMetadata = tables.find((t) => t.table === table)
  if (!tableMetadata) {
    return enqueNotification({
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
  const parentIdField = camelCase(tableMetadata.parentIdField)
  const idField = tableMetadata.idField
  if (!idField) {
    return enqueNotification({
      message: 'new dataset not created as no idField could be found',
      options: {
        variant: 'error',
      },
    })
  }
  let mutation = gql`
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
  let variables = { parentId }

  let jahr
  if (menuType === 'zielFolder') {
    jahr = 1
  }
  if (menuType === 'zieljahrFolder') {
    jahr = +id
    mutation = gql`
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
    variables = { parentId, jahr }
  }
  if (menuType === 'tpopfreiwkontrFolder') {
    mutation = gql`
      mutation create${upperFirst(camelCase(table))}(
        $parentId: UUID!
      ) {
        create${upperFirst(camelCase(table))} (
          input: {
            ${camelCase(table)}: {
              ${parentIdField}: $parentId
              typ: "Freiwilligen-Erfolgskontrolle"
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
    mutation = gql`
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
    mutation = gql`
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
    mutation = gql`
      mutation createWerte {
        create${upperFirst(tableName)}(input: { ${tableName}: {
          changedBy: "${store.user.name}"
        } }) {
          ${tableName} {
            ...${fields}
          }
        }
      }
      ${fragments[tableName]}
    `
    delete variables.parentId
  }

  let result
  try {
    if (Object.keys(variables).length) {
      result = await client.mutate({ mutation, variables })
    } else {
      result = await client.mutate({ mutation })
    }
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const row =
    result?.data[`create${upperFirst(camelCase(table))}`][`${camelCase(table)}`]
  // set new url
  const newActiveNodeArray = [...url, row[idField]]
  setActiveNodeArray(newActiveNodeArray)
  // set open nodes
  let newOpenNodes = [...openNodes, newActiveNodeArray]
  if (['zielFolder', 'zieljahrFolder'].includes(menuType)) {
    const urlWithoutJahr = [...url]
    urlWithoutJahr.pop()
    newOpenNodes = [...openNodes, urlWithoutJahr, newActiveNodeArray]
  }
  if (['tpopfeldkontr', 'tpopfeldkontrFolder'].includes(menuType)) {
    // 1. add new zaehlung
    const result = await client.mutate({
      mutation: gql`
        mutation createWerte($parentId: UUID!) {
          createTpopkontrzaehl(
            input: { tpopkontrzaehl: { tpopkontrId: $parentId } }
          ) {
            tpopkontrzaehl {
              id
            }
          }
        }
      `,
      variables: { parentId: row[idField] },
    })
    // 2. open the zaehlungFolder
    const zaehlId = result?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
    const newOpenFolder = [...newActiveNodeArray, 'Zaehlungen']
    const newOpenNode = [...newActiveNodeArray, 'Zaehlungen', zaehlId]
    newOpenNodes = [...newOpenNodes, newOpenFolder, newOpenNode]
  }
  setOpenNodes(newOpenNodes)
  client.refetchQueries({
    include: ['TreeAllQuery'],
  })
}

export default insertDataset
