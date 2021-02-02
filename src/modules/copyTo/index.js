/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */
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
const copyTo = async ({
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
  const tabelle = tables.find((t) => t.table === table)
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
      row = data0?.tpopkontrzaehlById
      break
    case 'tpopkontr':
      const { data: data1 } = await client.query({
        query: queryTpopKontrById,
        variables: { id },
      })
      row = data1?.tpopkontrById
      break
    case 'tpopmassn':
      const { data: data2 } = await client.query({
        query: queryTpopmassnById,
        variables: { id },
      })
      row = data2?.tpopmassnById
      break
    case 'tpop':
      const { data: data3 } = await client.query({
        query: queryTpopById,
        variables: { id },
      })
      row = data3?.tpopById
      break
    case 'pop':
      const { data: data4 } = await client.query({
        query: queryPopById,
        variables: { id },
      })
      row = data4?.popById
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
      newId = response?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
      break
    case 'tpopkontr':
      response = await client.mutate({
        mutation: createTpopkontr,
        variables: {
          tpopId: parentId,
          typ: row.typ,
          datum: row.datum,
          jahr: row.jahr,
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
        // update does not work because query contains filter
      })
      newId = response?.data?.createTpopkontr?.tpopkontr?.id
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
          zieleinheitEinheit: row.zieleinheitEinheit,
          zieleinheitAnzahl: row.zieleinheitAnzahl,
          wirtspflanze: row.wirtspflanze,
          herkunftPop: row.herkunftPop,
          sammeldatum: row.sammeldatum,
          vonAnzahlIndividuen: row.vonAnzahlIndividuen,
          form: row.form,
          pflanzanordnung: row.pflanzanordnung,
          bearbeiter: row.bearbeiter,
          planVorhanden: row.planVorhanden,
        },
      })
      newId = response?.data?.createTpopmassn?.tpopmassn?.id
      break
    case 'tpop':
      let geomPointTpop = row?.geomPoint?.geojson || null
      if (geomPointTpop) geomPointTpop = JSON.parse(geomPointTpop)
      response = await client.mutate({
        mutation: createTpop,
        variables: {
          popId: parentId,
          nr: row.nr,
          gemeinde: row.gemeinde,
          flurname: row.flurname,
          geomPoint: geomPointTpop,
          radius: row.radius,
          hoehe: row.hoehe,
          exposition: row.exposition,
          klima: row.klima,
          neigung: row.neigung,
          bodenTyp: row.bodenTyp,
          bodenKalkgehalt: row.bodenKalkgehalt,
          bodenDurchlaessigkeit: row.bodenDurchlaessigkeit,
          bodenHumus: row.bodenHumus,
          bodenNaehrstoffgehalt: row.bodenNaehrstoffgehalt,
          bodenAbtrag: row.bodenAbtrag,
          wasserhaushalt: row.wasserhaushalt,
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
          ekfrequenz: row.ekfrequenz,
          ekfrequenzAbweichend: row.ekfrequenzAbweichend,
          ekfKontrolleur: row.ekfKontrolleur,
          bemerkungen: row.bemerkungen,
          statusUnklar: row.statusUnklar,
        },
      })
      newId = response?.data?.createTpop?.tpop?.id
      break
    case 'pop':
      let geomPointPop = row?.geomPoint?.geojson
      if (geomPointPop) geomPointPop = JSON.parse(geomPointPop)
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
          geomPoint: geomPointPop,
        },
      })
      newId = response?.data?.createPop?.pop?.id
      break
    default:
      // do nothing
      break
  }
  refetch.tree()

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

export default copyTo
