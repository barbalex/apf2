import React, { useContext, useState, useCallback } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'
import { useSnackbar } from 'notistack'
import gql from 'graphql-tag'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'

const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const DownloadCardButton = styled(Button)`
  flex-basis: 450px;
  > span:first-of-type {
    text-transform: none !important;
    font-weight: 500;
    display: block;
    text-align: left;
    justify-content: flex-start !important;
    user-select: none;
  }
`

const AP = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    enqueNotification,
    removeNotification,
    apGqlFilter,
    dataFilterTableIsFiltered,
  } = store

  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])
  const onClickAp = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "AP" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: gql`
          query apForExportQuery($filter: ApFilter) {
            allAps(
              filter: $filter
              orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC
            ) {
              nodes {
                id
                aeTaxonomyByArtId {
                  id
                  artname
                }
                apBearbstandWerteByBearbeitung {
                  id
                  text
                }
                startJahr
                apUmsetzungWerteByUmsetzung {
                  id
                  text
                }
                changed
                changedBy
              }
            }
          }
        `,
        variables: {
          filter: apGqlFilter,
        },
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allAps.nodes', []).map((n) => ({
      id: n.id,
      artname: get(n, 'aeTaxonomyByArtId.artname') || null,
      bearbeitung: get(n, 'apBearbstandWerteByBearbeitung.text') || null,
      startJahr: n.startJahr,
      umsetzung: get(n, 'apUmsetzungWerteByUmsetzung.text') || null,
      changed: n.changed,
      changedBy: n.changedBy,
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
      fileName: 'AP',
      store,
    })
  }, [
    apGqlFilter,
    client,
    closeSnackbar,
    enqueNotification,
    removeNotification,
    store,
  ])

  const onClickApOhnePop = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApOhnePopulationen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryApOhnepops').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allAps.nodes', [])
      .filter((z) => get(z, 'popsByApId.totalCount') === 0)
      .map((z) => ({
        id: z.id,
        artname: get(z, 'aeTaxonomyByArtId.artname') || '',
        bearbeitung: get(z, 'apBearbstandWerteByBearbeitung.text') || '',
        start_jahr: z.startJahr,
        umsetzung: get(z, 'apUmsetzungWerteByUmsetzung.text') || '',
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
      fileName: 'ApOhnePopulationen',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickAnzMassnProAp = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApAnzahlMassnahmen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryApAnzMassns').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allAps.nodes', []).map((z) => ({
      id: z.id,
      artname: get(z, 'aeTaxonomyByArtId.artname') || '',
      bearbeitung: get(z, 'apBearbstandWerteByBearbeitung.text') || '',
      start_jahr: z.startJahr,
      umsetzung: get(z, 'apUmsetzungWerteByUmsetzung.text') || '',
      anzahl_kontrollen:
        get(z, 'vApAnzmassnsById.nodes[0].anzahlMassnahmen') || '',
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
      fileName: 'ApAnzahlMassnahmen',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickAnzKontrProAp = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApAnzahlKontrollen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryApAnzKontrs').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allAps.nodes', []).map((z) => ({
      id: z.id,
      artname: get(z, 'aeTaxonomyByArtId.artname') || '',
      bearbeitung: get(z, 'apBearbstandWerteByBearbeitung.text') || '',
      start_jahr: z.startJahr,
      umsetzung: get(z, 'apUmsetzungWerteByUmsetzung.text') || '',
      anzahl_kontrollen:
        get(z, 'vApAnzkontrsById.nodes[0].anzahlKontrollen') || '',
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
      fileName: 'ApAnzahlKontrollen',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickApBer = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Jahresberichte" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./queryApbers').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allApbers.nodes', []).map((z) => ({
      id: z.id,
      ap_id: z.apId,
      artname: get(z, 'apByApId.aeTaxonomyByArtId.artname') || '',
      jahr: z.jahr,
      situation: z.situation,
      vergleich_vorjahr_gesamtziel: z.vergleichVorjahrGesamtziel,
      beurteilung: z.beurteilung,
      beurteilung_decodiert: get(z, 'apErfkritWerteByBeurteilung.text') || '',
      veraenderung_zum_vorjahr: z.veraenderungZumVorjahr,
      apber_analyse: z.apberAnalyse,
      konsequenzen_umsetzung: z.konsequenzenUmsetzung,
      konsequenzen_erfolgskontrolle: z.konsequenzenErfolgskontrolle,
      biotope_neue: z.biotopeNeue,
      biotope_optimieren: z.biotopeOptimieren,
      massnahmen_optimieren: z.massnahmenOptimieren,
      wirkung_auf_art: z.wirkungAufArt,
      changed: z.changed,
      changed_by: z.changedBy,
      massnahmen_ap_bearb: z.massnahmenApBearb,
      massnahmen_planung_vs_ausfuehrung: z.massnahmenPlanungVsAusfuehrung,
      datum: z.datum,
      bearbeiter: z.bearbeiter,
      bearbeiter_decodiert: get(z, 'adresseByBearbeiter.name') || '',
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
      data: sortBy(rows, ['artname', 'jahr']),
      fileName: 'Jahresberichte',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickApBerUndMassn = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApJahresberichteUndMassnahmen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: await import('./allVApApberundmassns').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allVApApberundmassns.nodes', [])
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
      fileName: 'ApJahresberichteUndMassnahmen',
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
    const rows = get(result.data, 'allZiels.nodes', []).map((z) => ({
      ap_id: z.id,
      artname: get(z, 'apByApId.aeTaxonomyByArtId.artname') || '',
      ap_bearbeitung:
        get(z, 'apByApId.apBearbstandWerteByBearbeitung.text') || '',
      ap_start_jahr: get(z, 'apByApId.startJahr') || '',
      ap_umsetzung: get(z, 'apByApId.apUmsetzungWerteByUmsetzung.text') || '',
      ap_bearbeiter: get(z, 'apByApId.adresseByBearbeiter.name') || '',
      id: z.id,
      jahr: z.jahr,
      typ: get(z, 'zielTypWerteByTyp.text') || '',
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
    const rows = get(result.data, 'allZielbers.nodes', []).map((z) => ({
      ap_id: get(z, 'zielByZielId.apByApId.id') || '',
      artname: get(z, 'zielByZielId.apByApId.aeTaxonomyByArtId.artname') || '',
      ap_bearbeitung:
        get(z, 'zielByZielId.apByApId.apBearbstandWerteByBearbeitung.text') ||
        '',
      ap_start_jahr: get(z, 'zielByZielId.apByApId.startJahr') || '',
      ap_umsetzung:
        get(z, 'zielByZielId.apByApId.apUmsetzungWerteByUmsetzung.text') || '',
      ap_bearbeiter:
        get(z, 'zielByZielId.apByApId.adresseByBearbeiter.name') || '',
      ziel_id: get(z, 'zielByZielId.id') || '',
      ziel_jahr: get(z, 'zielByZielId.jahr') || '',
      ziel_typ: get(z, 'zielByZielId.zielTypWerteByTyp.text') || '',
      ziel_bezeichnung: get(z, 'zielByZielId.bezeichnung') || '',
      id: z.id,
      jahr: z.jahr,
      erreichung: z.erreichung,
      bemerkungen: z.bemerkungen,
      changed: z.changed,
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
        query: await import('./allVErfkrits').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allVErfkrits.nodes', [])
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
        query: await import('./allVIdealbiotops').then((m) => m.default),
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = get(result.data, 'allVIdealbiotops.nodes', [])
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
    console.log({ result })
    const rows = get(result.data, 'allAssozarts.nodes', []).map((z) => ({
      ap_id: z.apId,
      artname: get(z, 'apByApId.aeTaxonomyByArtId.artname') || '',
      ap_bearbeitung:
        get(z, 'apByApId.apBearbstandWerteByBearbeitung.text') || '',
      ap_start_jahr: get(z, 'apByApId.startJahr') || '',
      ap_umsetzung: get(z, 'apByApId.apUmsetzungWerteByUmsetzung.text') || '',
      ap_bearbeiter: get(z, 'apByApId.adresseByBearbeiter.name') || '',
      id: z.id,
      artname_assoziiert: get(z, 'aeTaxonomyByAeId.artname') || '',
      bemerkungen: z.bemerkungen,
      changed: z.changed,
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
      data: sortBy(rows, ['artname', 'artname_assoziiert']),
      fileName: 'AssoziierteArten',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const apIsFiltered = dataFilterTableIsFiltered({
    treeName: 'tree',
    table: 'ap',
  })

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Aktionsplan</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <StyledCardContent>
          <DownloadCardButton onClick={onClickAp}>
            {apIsFiltered ? 'Aktionspläne (gefiltert)' : 'Aktionspläne'}
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickApOhnePop}>
            Aktionspläne ohne Populationen
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickAnzMassnProAp}>
            Anzahl Massnahmen pro Aktionsplan
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickAnzKontrProAp}>
            Anzahl Kontrollen pro Aktionsplan
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickApBer}>
            AP-Berichte (Jahresberichte)
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickApBerUndMassn}>
            AP-Berichte und Massnahmen
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickZiele}>Ziele</DownloadCardButton>
          <DownloadCardButton onClick={onClickZielber}>
            Ziel-Berichte
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickErfkrit}>
            Erfolgskriterien
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickIdealbiotop}>
            Idealbiotope
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickAssozarten}>
            Assoziierte Arten
          </DownloadCardButton>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default observer(AP)
