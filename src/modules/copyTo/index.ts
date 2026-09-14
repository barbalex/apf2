/**
 * moves a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */
import type {
  PopFieldsFragment,
  TpopFieldsFragment,
  TpopkontrFieldsFragment,
  TpopkontrzaehlFieldsFragment,
  TpopmassnFieldsFragment,
} from '../../gql/graphql.ts'
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
  type Notification,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

type CopiedRow =
  | TpopkontrzaehlFieldsFragment
  | TpopkontrFieldsFragment
  | TpopmassnFieldsFragment
  | TpopFieldsFragment
  | PopFieldsFragment

// copyTpopsOfPop can pass table and id separately
export const copyTo = async ({
  parentId,
  table: tablePassed,
  id: idPassed,
}: {
  parentId?: string | undefined
  table?: string | undefined
  id?: string | undefined
}) => {
  const apolloClient = store.get(apolloClientAtom)!
  const tsQueryClient = store.get(tsQueryClientAtom)!

  const copying = store.get(copyingAtom)
  const table = tablePassed ?? copying.table
  const id = idPassed ?? copying.id
  const withNextLevel = copying.withNextLevel ?? false

  // ensure derived data exists
  const tabelle = tables.find((t) => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  const dbTable = tabelle?.dbTable ?? table

  // get data
  let row: CopiedRow | undefined
  switch (dbTable) {
    case 'tpopkontrzaehl': {
      const { data } = await apolloClient.query<{
        tpopkontrzaehlById?: TpopkontrzaehlFieldsFragment | null
      }>({
        query: queryTpopkontrzaehlById,
        variables: { id },
      })
      row = data?.tpopkontrzaehlById ?? undefined
      break
    }
    case 'tpopkontr': {
      const { data } = await apolloClient.query<{
        tpopkontrById?: TpopkontrFieldsFragment | null
      }>({
        query: queryTpopKontrById,
        variables: { id },
      })
      row = data?.tpopkontrById ?? undefined
      break
    }
    case 'tpopmassn': {
      const { data } = await apolloClient.query<{
        tpopmassnById?: TpopmassnFieldsFragment | null
      }>({
        query: queryTpopmassnById,
        variables: { id },
      })
      row = data?.tpopmassnById ?? undefined
      break
    }
    case 'tpop': {
      const { data } = await apolloClient.query<{
        tpopById?: TpopFieldsFragment | null
      }>({
        query: queryTpopById,
        variables: { id },
      })
      row = data?.tpopById ?? undefined
      break
    }
    case 'pop': {
      const { data } = await apolloClient.query<{
        popById?: PopFieldsFragment | null
      }>({
        query: queryPopById,
        variables: { id },
      })
      row = data?.popById ?? undefined
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
  let newId: string | null | undefined
  switch (dbTable) {
    case 'tpopkontrzaehl':
      // TODO: this never happens, right?
      {
        const kontrRow = row as TpopkontrzaehlFieldsFragment
        const response = await apolloClient.mutate<{
          createTpopkontrzaehl?: { tpopkontrzaehl?: { id: string } | null }
        }>({
          mutation: createTpopkontrzaehl,
          variables: {
            tpopkontrId: parentId,
            anzahl: kontrRow.anzahl,
            einheit: kontrRow.einheit,
            methode: kontrRow.methode,
          },
        })
        newId = response?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
      }
      break
    case 'tpopkontr':
      {
        const kontrRow = row as TpopkontrFieldsFragment
        const response = await apolloClient.mutate<{
          createTpopkontr?: { tpopkontr?: { id: string } | null }
        }>({
          mutation: createTpopkontr,
          variables: {
            tpopId: parentId,
            typ: kontrRow.typ,
            datum: kontrRow.datum,
            jahr: kontrRow.jahr,
            vitalitaet: kontrRow.vitalitaet,
            ueberlebensrate: kontrRow.ueberlebensrate,
            entwicklung: kontrRow.entwicklung,
            ursachen: kontrRow.ursachen,
            erfolgsbeurteilung: kontrRow.erfolgsbeurteilung,
            umsetzungAendern: kontrRow.umsetzungAendern,
            kontrolleAendern: kontrRow.kontrolleAendern,
            bemerkungen: kontrRow.bemerkungen,
            lrDelarze: kontrRow.lrDelarze,
            flaeche: kontrRow.flaeche,
            lrUmgebungDelarze: kontrRow.lrUmgebungDelarze,
            vegetationstyp: kontrRow.vegetationstyp,
            konkurrenz: kontrRow.konkurrenz,
            moosschicht: kontrRow.moosschicht,
            krautschicht: kontrRow.krautschicht,
            strauchschicht: kontrRow.strauchschicht,
            baumschicht: kontrRow.baumschicht,
            idealbiotopUebereinstimmung: kontrRow.idealbiotopUebereinstimmung,
            handlungsbedarf: kontrRow.handlungsbedarf,
            flaecheUeberprueft: kontrRow.flaecheUeberprueft,
            deckungVegetation: kontrRow.deckungVegetation,
            deckungNackterBoden: kontrRow.deckungNackterBoden,
            deckungApArt: kontrRow.deckungApArt,
            vegetationshoeheMaximum: kontrRow.vegetationshoeheMaximum,
            vegetationshoeheMittel: kontrRow.vegetationshoeheMittel,
            gefaehrdung: kontrRow.gefaehrdung,
            bearbeiter: kontrRow.bearbeiter,
            planVorhanden: kontrRow.planVorhanden,
            jungpflanzenVorhanden: kontrRow.jungpflanzenVorhanden,
          },
          // update does not work because query contains filter
        })
        newId = response?.data?.createTpopkontr?.tpopkontr?.id
      }
      break
    case 'tpopmassn':
      {
        const massnRow = row as TpopmassnFieldsFragment
        const response = await apolloClient.mutate<{
          createTpopmassn?: { tpopmassn?: { id: string } | null }
        }>({
          mutation: createTpopmassn,
          variables: {
            tpopId: parentId,
            typ: massnRow.typ,
            beschreibung: massnRow.beschreibung,
            jahr: massnRow.jahr,
            datum: massnRow.datum,
            bemerkungen: massnRow.bemerkungen,
            planBezeichnung: massnRow.planBezeichnung,
            flaeche: massnRow.flaeche,
            markierung: massnRow.markierung,
            anzTriebe: massnRow.anzTriebe,
            anzPflanzen: massnRow.anzPflanzen,
            anzPflanzstellen: massnRow.anzPflanzstellen,
            zieleinheitEinheit: massnRow.zieleinheitEinheit,
            zieleinheitAnzahl: massnRow.zieleinheitAnzahl,
            wirtspflanze: massnRow.wirtspflanze,
            herkunftPop: massnRow.herkunftPop,
            sammeldatum: massnRow.sammeldatum,
            vonAnzahlIndividuen: massnRow.vonAnzahlIndividuen,
            form: massnRow.form,
            pflanzanordnung: massnRow.pflanzanordnung,
            bearbeiter: massnRow.bearbeiter,
            planVorhanden: massnRow.planVorhanden,
          },
        })
        newId = response?.data?.createTpopmassn?.tpopmassn?.id
      }
      break
    case 'tpop':
      {
        const tpopRow = row as TpopFieldsFragment
        const response = await apolloClient.mutate<{
          createTpop?: { tpop?: { id: string } | null }
        }>({
          mutation: createTpop,
          variables: {
            popId: parentId,
            nr: tpopRow.nr,
            gemeinde: tpopRow.gemeinde,
            flurname: tpopRow.flurname,
            geomPoint:
              tpopRow?.geomPoint?.geojson ?
                JSON.parse(String(tpopRow.geomPoint.geojson))
              : null,
            radius: tpopRow.radius,
            hoehe: tpopRow.hoehe,
            exposition: tpopRow.exposition,
            klima: tpopRow.klima,
            neigung: tpopRow.neigung,
            bodenTyp: tpopRow.bodenTyp,
            bodenKalkgehalt: tpopRow.bodenKalkgehalt,
            bodenDurchlaessigkeit: tpopRow.bodenDurchlaessigkeit,
            bodenHumus: tpopRow.bodenHumus,
            bodenNaehrstoffgehalt: tpopRow.bodenNaehrstoffgehalt,
            bodenAbtrag: tpopRow.bodenAbtrag,
            wasserhaushalt: tpopRow.wasserhaushalt,
            beschreibung: tpopRow.beschreibung,
            katasterNr: tpopRow.katasterNr,
            status: tpopRow.status,
            statusUnklarGrund: tpopRow.statusUnklarGrund,
            apberRelevant: tpopRow.apberRelevant,
            apberRelevantGrund: tpopRow.apberRelevantGrund,
            bekanntSeit: tpopRow.bekanntSeit,
            eigentuemer: tpopRow.eigentuemer,
            kontakt: tpopRow.kontakt,
            nutzungszone: tpopRow.nutzungszone,
            bewirtschafter: tpopRow.bewirtschafter,
            bewirtschaftung: tpopRow.bewirtschaftung,
            ekfrequenz: tpopRow.ekfrequenz,
            ekfrequenzAbweichend: tpopRow.ekfrequenzAbweichend,
            ekfKontrolleur: tpopRow.ekfKontrolleur,
            bemerkungen: tpopRow.bemerkungen,
            statusUnklar: tpopRow.statusUnklar,
          },
        })
        newId = response?.data?.createTpop?.tpop?.id
      }
      break
    case 'pop':
      {
        const popRow = row as PopFieldsFragment
        const response = await apolloClient.mutate<{
          createPop?: { pop?: { id: string } | null }
        }>({
          mutation: createPop,
          variables: {
            apId: parentId,
            nr: popRow.nr,
            name: popRow.name,
            status: popRow.status,
            statusUnklar: popRow.statusUnklar,
            statusUnklarBegruendung: popRow.statusUnklarBegruendung,
            bekanntSeit: popRow.bekanntSeit,
            geomPoint:
              popRow?.geomPoint?.geojson ?
                JSON.parse(String(popRow.geomPoint.geojson))
              : null,
          },
        })
        newId = response?.data?.createPop?.pop?.id
      }
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
      tpopkontrIdFrom: id as string,
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
      popIdFrom: id as string,
      popIdTo: newId,
    })
  }
}
