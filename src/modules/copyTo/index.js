/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */
import { tables } from '../tables.js'
import { copyTpopsOfPop } from '../copyTpopsOfPop.js'
import { copyZaehlOfTpopKontr } from '../copyZaehlOfTpopKontr.js'
import { queryTpopKontrById } from './queryTpopKontrById.js'
import { queryTpopkontrzaehlById } from './queryTpopkontrzaehlById.js'
import { queryTpopmassnById } from './queryTpopmassnById.js'
import { queryTpopById } from './queryTpopById.js'
import { queryPopById } from './queryPopById.js'
import { createTpopkontr } from './createTpopkontr.js'
import { createTpopkontrzaehl } from './createTpopkontrzaehl.js'
import { createTpopmassn } from './createTpopmassn.js'
import { createTpop } from './createTpop.js'
import { createPop } from './createPop.js'

// copyTpopsOfPop can pass table and id separately
export const copyTo = async ({
  parentId,
  table: tablePassed,
  id: idPassed,
  apolloClient,
  store,
}) => {
  const { copying, enqueNotification } = store
  const table = tablePassed ?? copying.table
  const id = idPassed ?? copying.id
  const withNextLevel = copying.withNextLevel ?? false

  // ensure derived data exists
  const tabelle = tables.find((t) => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  const dbTable = tabelle?.dbTable ?? table

  // get data
  let row
  switch (dbTable) {
    case 'tpopkontrzaehl': {
      const { data } = await apolloClient.query({
        query: queryTpopkontrzaehlById,
        variables: { id },
      })
      row = data?.tpopkontrzaehlById
      break
    }
    case 'tpopkontr': {
      const { data } = await apolloClient.query({
        query: queryTpopKontrById,
        variables: { id },
      })
      row = data?.tpopkontrById
      break
    }
    case 'tpopmassn': {
      const { data } = await apolloClient.query({
        query: queryTpopmassnById,
        variables: { id },
      })
      row = data?.tpopmassnById
      break
    }
    case 'tpop': {
      const { data } = await apolloClient.query({
        query: queryTpopById,
        variables: { id },
      })
      row = data?.tpopById
      break
    }
    case 'pop': {
      const { data } = await apolloClient.query({
        query: queryPopById,
        variables: { id },
      })
      row = data?.popById
      break
    }
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
  switch (dbTable) {
    case 'tpopkontrzaehl':
      // TODO: this never happens, right?
      response = await apolloClient.mutate({
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
      response = await apolloClient.mutate({
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
      response = await apolloClient.mutate({
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
      response = await apolloClient.mutate({
        mutation: createTpop,
        variables: {
          popId: parentId,
          nr: row.nr,
          gemeinde: row.gemeinde,
          flurname: row.flurname,
          geomPoint:
            row?.geomPoint?.geojson ? JSON.parse(row.geomPoint.geojson) : null,
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
      response = await apolloClient.mutate({
        mutation: createPop,
        variables: {
          apId: parentId,
          nr: row.nr,
          name: row.name,
          status: row.status,
          statusUnklar: row.statusUnklar,
          statusUnklarBegruendung: row.statusUnklarBegruendung,
          bekanntSeit: row.bekanntSeit,
          geomPoint:
            row?.geomPoint?.geojson ? JSON.parse(row.geomPoint.geojson) : null,
        },
      })
      newId = response?.data?.createPop?.pop?.id
      break
    default:
      // do nothing
      break
  }
  // update tree data
  if (table === 'pop') {
    store.queryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treeApFolders'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
  }
  if (table === 'tpop') {
    store.queryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treePopFolders'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
  }
  if (table === 'tpopmassn') {
    store.queryClient.invalidateQueries({
      queryKey: ['treeTpopmassn'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }
  if (table === 'tpopfeldkontr') {
    // always copy Zaehlungen
    copyZaehlOfTpopKontr({
      tpopkontrIdFrom: id,
      tpopkontrIdTo: newId,
      apolloClient,
      store,
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treeTpopfeldkontr'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }
  if (table === 'tpopfreiwkontr') {
    store.queryClient.invalidateQueries({
      queryKey: ['treeTpopfreiwkontr'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }

  // copy tpop if needed
  if (table === 'pop' && withNextLevel) {
    copyTpopsOfPop({
      popIdFrom: id,
      popIdTo: newId,
      apolloClient,
      store,
    })
  }
}
