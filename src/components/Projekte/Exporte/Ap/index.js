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
    try {
      const { data } = await client.query({
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
      const dataToExport = get(data, 'allAps.nodes', []).map((n) => ({
        id: n.id,
        artname: get(n, 'aeTaxonomyByArtId.artname') || null,
        bearbeitung: get(n, 'apBearbstandWerteByBearbeitung.text') || null,
        startJahr: n.startJahr,
        umsetzung: get(n, 'apUmsetzungWerteByUmsetzung.text') || null,
        changed: n.changed,
        changedBy: n.changedBy,
      }))
      exportModule({
        data: dataToExport,
        fileName: 'AP',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
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
    try {
      const { data } = await client.query({
        query: await import('./allVApOhnepops').then((m) => m.default),
      })
      exportModule({
        data: get(data, 'allVApOhnepops.nodes', []),
        fileName: 'ApOhnePopulationen',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickAnzMassnProAp = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApAnzahlMassnahmen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./queryApAnzMassns').then((m) => m.default),
      })
      const apAnzMassns = get(data, 'allAps.nodes', []).map((z) => ({
        id: z.id,
        artname: get(z, 'aeTaxonomyByArtId.artname') || '',
        bearbeitung: get(z, 'apBearbstandWerteByBearbeitung.text') || '',
        start_jahr: z.startJahr,
        umsetzung: get(z, 'apUmsetzungWerteByUmsetzung.text') || '',
        anzahl_kontrollen:
          get(z, 'vApAnzmassnsById.nodes[0].anzahlMassnahmen') || '',
      }))
      exportModule({
        data: apAnzMassns,
        fileName: 'ApAnzahlMassnahmen',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickAnzKontrProAp = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApAnzahlKontrollen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./queryApAnzKontrs').then((m) => m.default),
      })
      const apAnzKontrs = get(data, 'allAps.nodes', []).map((z) => ({
        id: z.id,
        artname: get(z, 'aeTaxonomyByArtId.artname') || '',
        bearbeitung: get(z, 'apBearbstandWerteByBearbeitung.text') || '',
        start_jahr: z.startJahr,
        umsetzung: get(z, 'apUmsetzungWerteByUmsetzung.text') || '',
        anzahl_kontrollen:
          get(z, 'vApAnzkontrsById.nodes[0].anzahlKontrollen') || '',
      }))
      exportModule({
        data: apAnzKontrs,
        fileName: 'ApAnzahlKontrollen',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickApBer = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Jahresberichte" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./allVApbers').then((m) => m.default),
      })
      exportModule({
        data: get(data, 'allVApbers.nodes', []),
        fileName: 'Jahresberichte',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickApBerUndMassn = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApJahresberichteUndMassnahmen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./allVApApberundmassns').then((m) => m.default),
      })
      exportModule({
        data: get(data, 'allVApApberundmassns.nodes', []),
        fileName: 'ApJahresberichteUndMassnahmen',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickZiele = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "ApZiele" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./queryZiels').then((m) => m.default),
      })
      const ziels = get(data, 'allZiels.nodes', []).map((z) => ({
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
      exportModule({
        data: sortBy(ziels, 'artname'),
        fileName: 'ApZiele',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickZielber = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Zielberichte" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./queryZielbers').then((m) => m.default),
      })
      const zielbers = get(data, 'allZielbers.nodes', []).map((z) => ({
        ap_id: get(z, 'zielByZielId.apByApId.id') || '',
        artname:
          get(z, 'zielByZielId.apByApId.aeTaxonomyByArtId.artname') || '',
        ap_bearbeitung:
          get(z, 'zielByZielId.apByApId.apBearbstandWerteByBearbeitung.text') ||
          '',
        ap_start_jahr: get(z, 'zielByZielId.apByApId.startJahr') || '',
        ap_umsetzung:
          get(z, 'zielByZielId.apByApId.apUmsetzungWerteByUmsetzung.text') ||
          '',
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
      console.log({ zielbers })
      exportModule({
        data: sortBy(zielbers, ['artname', 'ziel_jahr', 'ziel_typ', 'jahr']),
        fileName: 'Zielberichte',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickErfkrit = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Erfolgskriterien" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./allVErfkrits').then((m) => m.default),
      })
      exportModule({
        data: get(data, 'allVErfkrits.nodes', []),
        fileName: 'Erfolgskriterien',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickIdealbiotop = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Idealbiotope" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./allVIdealbiotops').then((m) => m.default),
      })
      exportModule({
        data: get(data, 'allVIdealbiotops.nodes', []),
        fileName: 'Idealbiotope',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  const onClickAssozarten = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "AssoziierteArten" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./allVAssozarts').then((m) => m.default),
      })
      exportModule({
        data: get(data, 'allVAssozarts.nodes', []),
        fileName: 'AssoziierteArten',
        store,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    removeNotification(notif)
    closeSnackbar(notif)
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
