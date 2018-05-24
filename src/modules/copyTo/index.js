// @flow
/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */

import axios from 'axios'
import clone from 'lodash/clone'
import get from 'lodash/get'
import gql from 'graphql-tag'

import tables from '../tables'
import copyTpopsOfPop from '../copyTpopsOfPop'
import copyZaehlOfTpopKontr from '../copyZaehlOfTpopKontr'
import queryTpopKontrById from './queryTpopKontrById.graphql'
import queryTpopmassnById from './queryTpopmassnById.graphql'
import queryTpopById from './queryTpopById.graphql'
import queryPopById from './queryPopById.graphql'
import updateTpopkontrById from './updateTpopkontrById.graphql'
import updateTpopmassnById from './updateTpopmassnById.graphql'

// copyTpopsOfPop can pass table and id separately
export default async (
  store: Object,
  parentId: Number,
  tablePassed: ?String, // TODO: check if necessary
  idPassed: ?Number, // TODO: check if necessary
  client: Object
): Promise<void> => {
  const { data } = await client.query({
    query: gql`
        query Query {
          copying @client {
            table
            id
            label
            withNextLevel
          }
        }
      `
  })
  let table = get(data, 'moving.table')
  const id = get(data, 'moving.id')
  const withNextLevel = get(data, 'moving.withNextLevel')

  // ensure derived data exists
  const tabelle: {
    idField: string,
    table: string,
    parentIdField: string,
  } = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle && tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return store.listError(
      new Error('change was not saved because idField was not found')
    )
  }
  const { parentIdField } = tabelle
  if (!parentIdField) {
    return store.listError(
      new Error('change was not saved because parentIdField was not found')
    )
  }

  // get data
  
  // move
  let row
  switch (table) {
    case 'tpopkontr':
      const { data: data1 } = await client.query({
        query: queryTpopKontrById,
          variables: { id }
      })
      row = get(data1, 'tpopkontrById')
      break;
    case 'tpopmassn':
      const { data: data2 } = await client.query({
        query: queryTpopmassnById,
          variables: { id }
      })
      row = get(data2, 'tpopmassnById')
      break;
    case 'tpop':
      const { data: data3 } = await client.query({
        query: queryTpopById,
          variables: { id }
      })
      row = get(data3, 'tpopById')
      break;
    case 'pop':
      const { data: data4 } = await client.query({
        query: queryPopById,
          variables: { id }
      })
      row = get(data4, 'popById')
      break;
    default:
      // do nothing
      break;
  }

  if (!row) {
    return store.listError(
      new Error('change was not saved because dataset was not found in store')
    )
  }

  // build new row (for now without idField)
  const newRow = clone(row)
  newRow[parentIdField] = parentId
  delete newRow[idField]

  // TODO: update db
  let response: { data: Array<Object> }
  try {
    response = await axios({
      method: 'POST',
      url: `/${table}`,
      data: newRow,
      headers: {
        Prefer: 'return=representation',
      },
    })
  } catch (error) {
    store.listError(error)
  }
  const data = response.data[0]
  
  // move
  switch (table) {
    case 'tpopkontr':
      client.mutate({
        mutation: updateTpopkontrById,
        variables: {
          id,
          tpopId: parentId,
          typ: row.typ,
          datum: row.datum,
          jahr: row.jahr,
          jungpflanzenAnzahl: row.jungpflanzenAnzahl,
          vitalitaet: row.vitalitaet,
          ueberlebensrate: row.ueberlebensrate,
          entwicklung: row.entwicklung,
          ursachen: row.ursachen,
          erfolgsbeurteilung: row.erfolgsbeurteilung,
          umsetzungAendern: row.umsetzungAendern,
          kontrolleAendern: row.kontrolleAendern,
          bemerkungen: row.bemerkungen,
          lrDelarze: row.lrDelarze,
          flaeche: row.flaeche,
          lrUmgebungDelarze: row.lrUmgebungDelarze,
          vegetationstyp: row.vegetationstyp,
          konkurrenz: row.konkurrenz,
          moosschicht: row.moosschicht,
          krautschicht: row.krautschicht,
          strauchschicht: row.strauchschicht,
          baumschicht: row.baumschicht,
          bodenTyp: row.bodenTyp,
          bodenKalkgehalt: row.bodenKalkgehalt,
          bodenDurchlaessigkeit: row.bodenDurchlaessigkeit,
          bodenHumus: row.bodenHumus,
          bodenNaehrstoffgehalt: row.bodenNaehrstoffgehalt,
          bodenAbtrag: row.bodenAbtrag,
          wasserhaushalt: row.wasserhaushalt,
          idealbiotopUebereinstimmung: row.idealbiotopUebereinstimmung,
          handlungsbedarf: row.handlungsbedarf,
          flaecheUeberprueft: row.flaecheUeberprueft,
          deckungVegetation: row.deckungVegetation,
          deckungNackterBoden: row.deckungNackterBoden,
          deckungApArt: row.deckungApArt,
          vegetationshoeheMaximum: row.vegetationshoeheMaximum,
          vegetationshoeheMittel: row.vegetationshoeheMittel,
          gefaehrdung: row.gefaehrdung,
          bearbeiter: row.bearbeiter,
          planVorhanden: row.planVorhanden,
          jungpflanzenVorhanden: row.jungpflanzenVorhanden,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopkontrById: {
            tpopkontr: {
              id,
              tpopId: parentId,
              typ: row.typ,
              datum: row.datum,
              jahr: row.jahr,
              jungpflanzenAnzahl: row.jungpflanzenAnzahl,
              vitalitaet: row.vitalitaet,
              ueberlebensrate: row.ueberlebensrate,
              entwicklung: row.entwicklung,
              ursachen: row.ursachen,
              erfolgsbeurteilung: row.erfolgsbeurteilung,
              umsetzungAendern: row.umsetzungAendern,
              kontrolleAendern: row.kontrolleAendern,
              bemerkungen: row.bemerkungen,
              lrDelarze: row.lrDelarze,
              flaeche: row.flaeche,
              lrUmgebungDelarze: row.lrUmgebungDelarze,
              vegetationstyp: row.vegetationstyp,
              konkurrenz: row.konkurrenz,
              moosschicht: row.moosschicht,
              krautschicht: row.krautschicht,
              strauchschicht: row.strauchschicht,
              baumschicht: row.baumschicht,
              bodenTyp: row.bodenTyp,
              bodenKalkgehalt: row.bodenKalkgehalt,
              bodenDurchlaessigkeit: row.bodenDurchlaessigkeit,
              bodenHumus: row.bodenHumus,
              bodenNaehrstoffgehalt: row.bodenNaehrstoffgehalt,
              bodenAbtrag: row.bodenAbtrag,
              wasserhaushalt: row.wasserhaushalt,
              idealbiotopUebereinstimmung: row.idealbiotopUebereinstimmung,
              handlungsbedarf: row.handlungsbedarf,
              flaecheUeberprueft: row.flaecheUeberprueft,
              deckungVegetation: row.deckungVegetation,
              deckungNackterBoden: row.deckungNackterBoden,
              deckungApArt: row.deckungApArt,
              vegetationshoeheMaximum: row.vegetationshoeheMaximum,
              vegetationshoeheMittel: row.vegetationshoeheMittel,
              gefaehrdung: row.gefaehrdung,
              bearbeiter: row.bearbeiter,
              planVorhanden: row.planVorhanden,
              jungpflanzenVorhanden: row.jungpflanzenVorhanden,
              __typename: 'Tpopkontr',
            },
            __typename: 'Tpopkontr',
          },
        },
      })
      break;
    case 'tpopmassn':
      client.mutate({
        mutation: updateTpopmassnById,
        variables: {
          id,
          tpopId: parentId,
          typ: row.typ,
          beschreibung: row.beschreibung,
          jahr: row.jahr,
          datum: row.datum,
          bemerkungen: row.bemerkungen,
          planBezeichnung: row.planBezeichnung,
          flaeche: row.flaeche,
          markierung: row.markierung,
          anzTriebe: row.anzTriebe,
          anzPflanzen: row.anzPflanzen,
          anzPflanzstellen: row.anzPflanzstellen,
          wirtspflanze: row.wirtspflanze,
          herkunftPop: row.herkunftPop,
          sammeldatum: row.sammeldatum,
          form: row.form,
          pflanzanordnung: row.pflanzanordnung,
          bearbeiter: row.bearbeiter,
          planVorhanden: row.planVorhanden,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopmassnById: {
            tpopmassn: {
              id,
              tpopId: parentId,
              typ: row.typ,
              beschreibung: row.beschreibung,
              jahr: row.jahr,
              datum: row.datum,
              bemerkungen: row.bemerkungen,
              planBezeichnung: row.planBezeichnung,
              flaeche: row.flaeche,
              markierung: row.markierung,
              anzTriebe: row.anzTriebe,
              anzPflanzen: row.anzPflanzen,
              anzPflanzstellen: row.anzPflanzstellen,
              wirtspflanze: row.wirtspflanze,
              herkunftPop: row.herkunftPop,
              sammeldatum: row.sammeldatum,
              form: row.form,
              pflanzanordnung: row.pflanzanordnung,
              bearbeiter: row.bearbeiter,
              planVorhanden: row.planVorhanden,
              __typename: 'Tpopmassn',
            },
            __typename: 'Tpopmassn',
          },
        },
      })
      break;
    case 'tpop':
      client.mutate({
        mutation: gql`
          mutation updateTpopById($id: UUID!, $popId: UUID!) {
            updateTpopById(id: $id, popId: $popId) {
              input: {
                id: $id
                tpopPatch: {
                  popId: $popId
                }
              }
            }
          }
        `,
        variables: { id },
        optimisticResponse: {
        },
      })
      break;
    case 'pop':
      client.mutate({
        mutation: gql`
          mutation updatePopById($id: UUID!, $apId: UUID!) {
            updatePopById(id: $id, apId: $apId) {
              input: {
                id: $id
                popPatch: {
                  apId: $apId
                }
              }
            }
          }
        `,
        variables: { id },
        optimisticResponse: {
        },
      })
      break;
    default:
      // do nothing
      break;
  }


  // check if need to copy tpop
  if (table === 'pop' && withNextLevel) {
    copyTpopsOfPop({ store, popIdFrom: id, popIdTo: data.id })
  }
  if (table === 'tpopkontr') {
    // always copy Zaehlungen
    copyZaehlOfTpopKontr({
      store,
      tpopkontrIdFrom: id,
      tpopkontrIdTo: data.id,
    })
  }
}
