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
import EkPlanung from './EkPlanung'
import Ziele from './Ziele'
import Zielber from './Zielber'

const ApExports = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, removeNotification } = store

  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])

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
            <EkPlanung />
            <Ziele />
            <Zielber />
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
