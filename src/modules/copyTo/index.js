/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */
import get from 'lodash/get'

import tables from '../tables'
import copyTpopsOfPop from '../copyTpopsOfPop'
import copyZaehlOfTpopKontr from '../copyZaehlOfTpopKontr'
import queryTpopKontrById from './queryTpopKontrById'
import queryTpopKontrzaehlById from './queryTpopkontrzaehlById'
import queryTpopmassnById from './queryTpopmassnById'
import queryTpopById from './queryTpopById'
import queryPopById from './queryPopById'
import createTpopkontr from './createTpopkontr'
import createTpopkontrzaehl from './createTpopkontrzaehl'
import createTpopmassn from './createTpopmassn'
import createTpop from './createTpop'
import createPop from './createPop'
//import queryTpopfeldkontr from './queryTpopfeldkontr'
//import queryTpopfreiwkontr from './queryTpopfreiwkontr'

// copyTpopsOfPop can pass table and id separately
export default async ({
  parentId,
  table: tablePassed,
  id: idPassed,
  client,
  store,
}) => {
  const { refetch, copying, enqueNotification } = store
  let table = tablePassed || copying.table
  const id = idPassed || copying.id
  const withNextLevel = copying.withNextLevel

  // ensure derived data exists
  const tabelle = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle && tabelle.dbTable) {
    table = tabelle.dbTable
  }

  // get data
  let row
  switch (table) {
    case 'tpopkontrzaehl':
      const { data: data0 } = await client.query({
        query: queryTpopKontrzaehlById,
        variables: { id },
      })
      row = get(data0, 'tpopkontrzaehlById')
      break
    case 'tpopkontr':
      const { data: data1 } = await client.query({
        query: queryTpopKontrById,
        variables: { id },
      })
      row = get(data1, 'tpopkontrById')
      break
    case 'tpopmassn':
      const { data: data2 } = await client.query({
        query: queryTpopmassnById,
        variables: { id },
      })
      row = get(data2, 'tpopmassnById')
      break
    case 'tpop':
      const { data: data3 } = await client.query({
        query: queryTpopById,
        variables: { id },
      })
      row = get(data3, 'tpopById')
      break
    case 'pop':
      const { data: data4 } = await client.query({
        query: queryPopById,
        variables: { id },
      })
      row = get(data4, 'popById')
      break
    default:
      // do nothing
      break
  }

  if (!row) {
    return enqueNotification({
      message: 'change was not saved because dataset was not found in store',
      options: {
        variant: 'error',
      },
    })
  }

  // insert
  let response
  let newId
  switch (table) {
    case 'tpopkontrzaehl':
      response = await client.mutate({
        mutation: createTpopkontrzaehl,
        variables: {
          tpopkontrId: parentId,
          anzahl: row.anzahl,
          einheit: row.einheit,
          methode: row.methode,
        },
      })
      newId = get(response, 'data.createTpopkontrzaehl.tpopkontrzaehl.id')
      break
    case 'tpopkontr':
      response = await client.mutate({
        mutation: createTpopkontr,
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
        /**
         * update does not work because query contains filter
         */
        /*
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopkontrById: {
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
        },*/
        /*
        update: (proxy, { data: { updateTpopkontrById } }) => {
          // Read the data from our cache for this query.
          // need to use exact same query with which data was queried!
          let data
          const kontrTyp = get(updateTpopkontrById, 'tpopkontr.typ')
          if (kontrTyp !== 'Freiwilligen-Erfolgskontrolle') {
            data = proxy.readQuery({
              query: queryTpopfeldkontr,
              variables: { tpop: parentId },
            })
          } else {
            data = proxy.readQuery({
              query: queryTpopfreiwkontr,
              variables: { tpop: parentId },
            })
          }
          // Add our comment from the mutation to the end.
          data.tpopkontr.push(updateTpopkontrById.tpopkontr)
          // Write our data back to the cache.
          if (kontrTyp !== 'Freiwilligen-Erfolgskontrolle') {
            proxy.writeQuery({ query: queryTpopfeldkontr, data })
          } else {
            proxy.writeQuery({ query: queryTpopfreiwkontr, data })
          }
        },*/
      })
      newId = get(response, 'data.createTpopkontr.tpopkontr.id')
      break
    case 'tpopmassn':
      response = await client.mutate({
        mutation: createTpopmassn,
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
      })
      newId = get(response, 'data.createTpopmassn.tpopmassn.id')
      break
    case 'tpop':
      response = await client.mutate({
        mutation: createTpop,
        variables: {
          popId: parentId,
          nr: row.nr,
          gemeinde: row.gemeinde,
          flurname: row.flurname,
          geomPoint: row.geomPoint,
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
          apberRelevantGrund: row.apberRelevantGrund,
          bekanntSeit: row.bekanntSeit,
          eigentuemer: row.eigentuemer,
          kontakt: row.kontakt,
          nutzungszone: row.nutzungszone,
          bewirtschafter: row.bewirtschafter,
          bewirtschaftung: row.bewirtschaftung,
          kontrollfrequenz: row.kontrollfrequenz,
          kontrollfrequenzFreiwillige: row.kontrollfrequenzFreiwillige,
          bemerkungen: row.bemerkungen,
          statusUnklar: row.statusUnklar,
        },
      })
      newId = get(response, 'data.createTpop.tpop.id')
      break
    case 'pop':
      response = await client.mutate({
        mutation: createPop,
        variables: {
          apId: parentId,
          nr: row.nr,
          name: row.name,
          status: row.status,
          statusUnklar: row.statusUnklar,
          statusUnklarBegruendung: row.statusUnklarBegruendung,
          bekanntSeit: row.bekanntSeit,
          geomPoint: row.geomPoint,
        },
      })
      newId = get(response, 'data.createPop.pop.id')
      break
    default:
      // do nothing
      break
  }
  if (table) refetch[`${table}s`]()
  refetch.aps()
  refetch.pops()
  refetch.tpops()
  refetch.tpopfeldkontrs()

  // copy tpop if needed
  if (table === 'pop' && withNextLevel) {
    copyTpopsOfPop({
      popIdFrom: id,
      popIdTo: newId,
      client,
      store,
    })
  }
  if (table === 'tpopkontr') {
    // always copy Zaehlungen
    copyZaehlOfTpopKontr({
      tpopkontrIdFrom: id,
      tpopkontrIdTo: newId,
      client,
      store,
    })
  }
}
