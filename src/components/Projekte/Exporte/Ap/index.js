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
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'
import { useSnackbar } from 'notistack'

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
  transform: ${props => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
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
    mapFilter,
    exportApplyMapFilter,
    exportFileType,
    enqueNotification,
    removeNotification,
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
        query: await import('./allVAps').then(m => m.default),
      })
      exportModule({
        data: get(data, 'allVAps.nodes', []),
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
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

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
        query: await import('./allVApOhnepops').then(m => m.default),
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
        query: await import('./allVApAnzmassns').then(m => m.default),
      })
      exportModule({
        data: get(data, 'allVApAnzmassns.nodes', []),
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
        query: await import('./allVApAnzkontrs').then(m => m.default),
      })
      exportModule({
        data: get(data, 'allVApAnzkontrs.nodes', []),
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
        query: await import('./allVApbers').then(m => m.default),
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
        query: await import('./allVApApberundmassns').then(m => m.default),
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
        query: await import('./allVZiels').then(m => m.default),
      })
      exportModule({
        data: get(data, 'allVZiels.nodes', []),
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
        query: await import('./allVZielbers').then(m => m.default),
      })
      exportModule({
        data: get(data, 'allVZielbers.nodes', []),
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

  const onClickBer = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Berichte" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    try {
      const { data } = await client.query({
        query: await import('./allVBers').then(m => m.default),
      })
      exportModule({
        data: get(data, 'allVBers.nodes', []),
        fileName: 'Berichte',
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
        query: await import('./allVErfkrits').then(m => m.default),
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
        query: await import('./allVIdealbiotops').then(m => m.default),
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
        query: await import('./allVAssozarts').then(m => m.default),
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
            Aktionspläne
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
          <DownloadCardButton onClick={onClickBer}>Berichte</DownloadCardButton>
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
