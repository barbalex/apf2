// @flow
/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */

import axios from 'axios'
import clone from 'lodash/clone'
import get from 'lodash/get'
import gql from 'graphql-tag'

import tables from './tables'
import copyTpopsOfPop from './copyTpopsOfPop'
import copyZaehlOfTpopKontr from './copyZaehlOfTpopKontr'

// copyTpopsOfPop can pass table and id separately
export default async (
  store: Object,
  parentId: Number,
  tablePassed: ?String,
  idPassed: ?Number,
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
        query: gql`
            query Query($id: UUID!) {
              tpopkontrById(id: $id) {
                id
                typ
                datum
                jahr
                jungpflanzenAnzahl
                vitalitaet
                ueberlebensrate
                entwicklung
                ursachen
                erfolgsbeurteilung
                umsetzungAendern
                kontrolleAendern
                bemerkungen
                lrDelarze
                flaeche
                lrUmgebungDelarze
                vegetationstyp
                konkurrenz
                moosschicht
                krautschicht
                strauchschicht
                baumschicht
                bodenTyp
                bodenKalkgehalt
                bodenDurchlaessigkeit
                bodenHumus
                bodenNaehrstoffgehalt
                bodenAbtrag
                wasserhaushalt
                idealbiotopUebereinstimmung
                handlungsbedarf
                flaecheUeberprueft
                deckungVegetation
                deckungNackterBoden
                deckungApArt
                vegetationshoeheMaximum
                vegetationshoeheMittel
                gefaehrdung
                bearbeiter
                planVorhanden
                jungpflanzenVorhanden
              }
            }
          `,
          variables: { id }
      })
      row = get(data1, 'tpopkontrById')
      break;
    case 'tpopmassn':
      const { data: data2 } = await client.query({
        query: gql`
            query Query($id: UUID!) {
              tpopmassnById(id: $id) {
                id
                typ
                beschreibung
                jahr
                datum
                bemerkungen
                planBezeichnung
                flaeche
                markierung
                anzTriebe
                anzPflanzen
                anzPflanzstellen
                wirtspflanze
                herkunftPop
                sammeldatum
                form
                pflanzanordnung
                bearbeiter
                planVorhanden
              }
            }
          `,
          variables: { id }
      })
      row = get(data2, 'tpopmassnById')
      break;
    case 'tpop':
      const { data: data3 } = await client.query({
        query: gql`
            query Query($id: UUID!) {
              tpopById(id: $id) {
                id
                nr
                gemeinde
                flurname
                x
                y
                radius
                hoehe
                exposition
                klima
                neigung
                beschreibung
                katasterNr
                status
                statusUnklarGrund
                apberRelevant
                bekanntSeit
                eigentuemer
                kontakt
                nutzungszone
                bewirtschafter
                bewirtschaftung
                bemerkungen
                statusUnklar
              }
            }
          `,
          variables: { id }
      })
      row = get(data3, 'tpopById')
      break;
    case 'pop':
      const { data: data4 } = await client.query({
        query: gql`
            query Query($id: UUID!) {
              popById(id: $id) {
                id
                nr
                name
                status
                statusUnklar
                statusUnklarBegruendung
                bekanntSeit
                x
                y
              }
            }
          `,
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
  // can't write to store before, because db creates id and guid
  store.writeToStore({ data: [data], table, field: idField })
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
