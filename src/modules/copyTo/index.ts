/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */
import { tables } from '../tables.ts'
import { copyTpopsOfPop } from '../copyTpopsOfPop.ts'
import { copyZaehlOfTpopKontr } from '../copyZaehlOfTpopKontr.ts'
import { queryTpopKontrById } from './queryTpopKontrById.ts'
import { queryTpopkontrzaehlById } from './queryTpopkontrzaehlById.ts'
import { queryTpopmassnById } from './queryTpopmassnById.ts'
import { queryTpopById } from './queryTpopById.ts'
import { queryPopById } from './queryPopById.ts'
import { createTpopkontr } from './createTpopkontr.ts'
import { createTpopkontrzaehl } from './createTpopkontrzaehl.ts'
import { createTpopmassn } from './createTpopmassn.ts'
import { createTpop } from './createTpop.ts'
import { createPop } from './createPop.ts'

import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  copyingAtom,
} from '../../store/index.ts'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

// copyTpopsOfPop can pass table and id separately
export const copyTo = async ({
  parentId,
  table: tablePassed,
  id: idPassed,
}) => {
  const apolloClient = store.get(apolloClientAtom)
  tsQueryClient = store.get(tsQueryClientAtom)

  const copying = store.get(copyingAtom)
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
    return addNotification({
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
    tsQueryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeApFolders'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
  }
  if (table === 'tpop') {
    tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treePopFolders'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
  }
  if (table === 'tpopmassn') {
    tsQueryClient.invalidateQueries({
      queryKey: ['treeTpopmassn'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }
  if (table === 'tpopfeldkontr') {
    // always copy Zaehlungen
    copyZaehlOfTpopKontr({
      tpopkontrIdFrom: id,
      tpopkontrIdTo: newId,
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeTpopfeldkontr'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }
  if (table === 'tpopfreiwkontr') {
    tsQueryClient.invalidateQueries({
      queryKey: ['treeTpopfreiwkontr'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }

  // copy tpop if needed
  if (table === 'pop' && withNextLevel) {
    copyTpopsOfPop({
      popIdFrom: id,
      popIdTo: newId,
    })
  }
}
