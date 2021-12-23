import React, { useContext, useState, useCallback } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useSnackbar } from 'notistack'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
  DownloadCardButton,
} from '../index'
import Ap from './Ap'
import ApOhnePop from './ApOhnePop'
import AnzMassn from './AnzMassn'
import AnzKontr from './AnzKontr'
import Ber from './Ber'
import BerUndMassn from './BerUndMassn'
import PriorisierungFuerEk from './PriorisierungFuerEk'

const ApExports = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, removeNotification } = store

  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])

  const onClickEkPlanung = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "EkPlanungProJahrNachAbrechnungstyp" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryEkPlanungNachAbrechnungstyp').then(
          (m) => m.default,
        ),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = (
      result.data?.allVEkPlanungNachAbrechnungstyps?.nodes ?? []
    ).map((z) => ({
      ap_id: z?.apId,
      artname: z?.artname ?? '',
      artverantwortlich: z?.artverantwortlich ?? '',
      jahr: z.jahr ?? '',
      a: z?.a ?? 0,
      b: z?.b ?? 0,
      d: z?.d ?? 0,
      ekf: z?.ekf ?? 0,
    }))
    console.log('Exporte AP, rows:', {
      rows,
      data: result.data?.allVEkPlanungNachAbrechnungstyps?.nodes ?? [],
      result,
    })
    removeNotification(notif)
    closeSnackbar(notif)
    if (rows.length === 0) {
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: rows,
      fileName: 'EkPlanungProJahrNachAbrechnungstyp',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickZiele = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApZiele" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryZiels').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = (result.data?.allZiels?.nodes ?? []).map((z) => ({
      ap_id: z.id,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      jahr: z.jahr,
      typ: z?.zielTypWerteByTyp?.text ?? '',
      bezeichnung: z.bezeichnung,
    }))
    removeNotification(notif)
    closeSnackbar(notif)
    if (rows.length === 0) {
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: sortBy(rows, 'artname'),
      fileName: 'ApZiele',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickZielber = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Zielberichte" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryZielbers').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = (result.data?.allZielbers?.nodes ?? []).map((z) => ({
      ap_id: z?.zielByZielId?.apByApId?.id ?? '',
      artname: z?.zielByZielId?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung:
        z?.zielByZielId?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.zielByZielId?.apByApId?.startJahr ?? '',
      ap_umsetzung:
        z?.zielByZielId?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.zielByZielId?.apByApId?.adresseByBearbeiter?.name ?? '',
      ziel_id: z?.zielByZielId?.id ?? '',
      ziel_jahr: z?.zielByZielId?.jahr ?? '',
      ziel_typ: z?.zielByZielId?.zielTypWerteByTyp?.text ?? '',
      ziel_bezeichnung: z?.zielByZielId?.bezeichnung ?? '',
      id: z.id,
      jahr: z.jahr,
      erreichung: z.erreichung,
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changed_by,
    }))
    removeNotification(notif)
    closeSnackbar(notif)
    if (rows.length === 0) {
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: sortBy(rows, ['artname', 'ziel_jahr', 'ziel_typ', 'jahr']),
      fileName: 'Zielberichte',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickErfkrit = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Erfolgskriterien" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryErfkrits').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = (result.data?.allErfkrits?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      beurteilung: z?.apErfkritWerteByErfolg?.text ?? '',
      kriterien: z.kriterien,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
    }))
    removeNotification(notif)
    closeSnackbar(notif)
    if (rows.length === 0) {
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: sortBy(rows, ['artname', 'beurteilung']),
      fileName: 'Erfolgskriterien',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickIdealbiotop = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Idealbiotope" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryIdealbiotops').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = (result.data?.allIdealbiotops?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      erstelldatum: z.erstelldatum,
      hoehenlage: z.hoehenlage,
      region: z.region,
      exposition: z.exposition,
      besonnung: z.besonnung,
      hangneigung: z.hangneigung,
      boden_typ: z.bodenTyp,
      boden_kalkgehalt: z.bodenKalkgehalt,
      boden_durchlaessigkeit: z.bodenDurchlaessigkeit,
      boden_humus: z.bodenHumus,
      boden_naehrstoffgehalt: z.bodenNaehrstoffgehalt,
      wasserhaushalt: z.wasserhaushalt,
      konkurrenz: z.konkurrenz,
      moosschicht: z.moosschicht,
      krautschicht: z.krautschicht,
      strauchschicht: z.strauchschicht,
      baumschicht: z.baumschicht,
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
    }))
    removeNotification(notif)
    closeSnackbar(notif)
    if (rows.length === 0) {
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: sortBy(rows, 'artname'),
      fileName: 'Idealbiotope',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickAssozarten = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "AssoziierteArten" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryAssozarts').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = (result.data?.allAssozarts?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.label ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      artname_assoziiert: z?.aeTaxonomyByAeId?.artname ?? '',
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
    }))
    removeNotification(notif)
    closeSnackbar(notif)
    if (rows.length === 0) {
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: rows,
      fileName: 'AssoziierteArten',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Aktionsplan</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
          color="inherit"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {expanded ? (
          <StyledCardContent>
            <Ap />
            <ApOhnePop />
            <AnzMassn />
            <AnzKontr />
            <Ber />
            <BerUndMassn />
            <PriorisierungFuerEk />
            <DownloadCardButton onClick={onClickEkPlanung} color="inherit">
              EK-Planung pro Jahr nach Abrechnungstyp
            </DownloadCardButton>
            <DownloadCardButton onClick={onClickZiele} color="inherit">
              Ziele
            </DownloadCardButton>
            <DownloadCardButton onClick={onClickZielber} color="inherit">
              Ziel-Berichte
            </DownloadCardButton>
            <DownloadCardButton onClick={onClickErfkrit} color="inherit">
              Erfolgskriterien
            </DownloadCardButton>
            <DownloadCardButton onClick={onClickIdealbiotop} color="inherit">
              Idealbiotope
            </DownloadCardButton>
            <DownloadCardButton onClick={onClickAssozarten} color="inherit">
              Assoziierte Arten
            </DownloadCardButton>
          </StyledCardContent>
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default observer(ApExports)
