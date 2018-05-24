// @flow
/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */
import get from 'lodash/get'
import gql from 'graphql-tag'

import tables from '../tables'
import copyTpopsOfPop from '../copyTpopsOfPop'
import copyZaehlOfTpopKontr from '../copyZaehlOfTpopKontr'
import queryTpopKontrById from './queryTpopKontrById.graphql'
import queryTpopmassnById from './queryTpopmassnById.graphql'
import queryTpopById from './queryTpopById.graphql'
import queryPopById from './queryPopById.graphql'
import createTpopkontrById from './createTpopkontrById.graphql'
import createTpopmassnById from './createTpopmassnById.graphql'
import createTpopById from './createTpopById.graphql'
import createPopById from './createPopById.graphql'

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
  
  // insert
  let response
  let newId
  switch (table) {
    case 'tpopkontr':
      response = await client.mutate({
        mutation: createTpopkontrById,
        variables: {
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
          createTpopkontrById: {
            tpopkontr: {
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
      newId = get(response, 'data.tpopkontr')
      break;
    case 'tpopmassn':
      response = await client.mutate({
        mutation: createTpopmassnById,
        variables: {
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
          createTpopmassnById: {
            tpopmassn: {
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
      newId = get(response, 'data.tpopmassn')
      break;
    case 'tpop':
      response = await client.mutate({
        mutation: createTpopById,
        variables: {
          popId: parentId,
          nr: row.nr,
          gemeinde: row.gemeinde,
          flurname: row.flurname,
          x: row.x,
          y: row.y,
          radius: row.radius,
          hoehe: row.hoehe,
          exposition: row.exposition,
          klima: row.klima,
          neigung: row.neigung,
          beschreibung: row.beschreibung,
          katasterNr: row.katasterNr,
          status: row.status,
          statusUnklarGrund: row.statusUnklarGrund,
          apberRelevant: row.apberRelevant,
          bekanntSeit: row.bekanntSeit,
          eigentuemer: row.eigentuemer,
          kontakt: row.kontakt,
          nutzungszone: row.nutzungszone,
          bewirtschafter: row.bewirtschafter,
          bewirtschaftung: row.bewirtschaftung,
          bemerkungen: row.bemerkungen,
          statusUnklar: row.statusUnklar,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createTpopById: {
            tpop: {
              popId: parentId,
              nr: row.nr,
              gemeinde: row.gemeinde,
              flurname: row.flurname,
              x: row.x,
              y: row.y,
              radius: row.radius,
              hoehe: row.hoehe,
              exposition: row.exposition,
              klima: row.klima,
              neigung: row.neigung,
              beschreibung: row.beschreibung,
              katasterNr: row.katasterNr,
              status: row.status,
              statusUnklarGrund: row.statusUnklarGrund,
              apberRelevant: row.apberRelevant,
              bekanntSeit: row.bekanntSeit,
              eigentuemer: row.eigentuemer,
              kontakt: row.kontakt,
              nutzungszone: row.nutzungszone,
              bewirtschafter: row.bewirtschafter,
              bewirtschaftung: row.bewirtschaftung,
              bemerkungen: row.bemerkungen,
              statusUnklar: row.statusUnklar,
              __typename: 'Tpop',
            },
            __typename: 'Tpop',
          },
        },
      })
      newId = get(response, 'data.tpop')
      break;
    case 'pop':
      response = await client.mutate({
        mutation: createPopById,
        variables: {
          apId: parentId,
          nr: row.nr,
          name: row.name,
          status: row.status,
          statusUnklar: row.statusUnklar,
          statusUnklarBegruendung: row.statusUnklarBegruendung,
          bekanntSeit: row.bekanntSeit,
          x: row.x,
          y: row.y,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createPopById: {
            pop: {
              apId: parentId,
              nr: row.nr,
              name: row.name,
              status: row.status,
              statusUnklar: row.statusUnklar,
              statusUnklarBegruendung: row.statusUnklarBegruendung,
              bekanntSeit: row.bekanntSeit,
              x: row.x,
              y: row.y,
              __typename: 'Pop',
            },
            __typename: 'Pop',
          },
        },
      })
      newId = get(response, 'data.pop')
      break;
    default:
      // do nothing
      break;
  }

  // TODO: check if need to copy tpop
  if (table === 'pop' && withNextLevel) {
    copyTpopsOfPop({ store, popIdFrom: id, popIdTo: newId })
  }
  if (table === 'tpopkontr') {
    // TODO: always copy Zaehlungen
    copyZaehlOfTpopKontr({
      store,
      tpopkontrIdFrom: id,
      tpopkontrIdTo: newId,
    })
  }
}
