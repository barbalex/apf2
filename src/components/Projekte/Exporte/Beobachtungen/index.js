import React, { useContext, useState, useCallback } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useSnackbar } from 'notistack'

import exportModule from '../../../../modules/export'
import queryBeobZugeordnet from './queryBeobZugeordnet'
import queryBeobNichtZuzuordnen from './queryBeobNichtZuzuordnen'
import allVBeobArtChangeds from './allVBeobArtChangeds'
import storeContext from '../../../../storeContext'
import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
  DownloadCardButton,
} from '../index'

const Beobachtungen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, removeNotification } = store

  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])
  const onClickButton = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Beobachtungen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: allVBeobArtChangeds,
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    const rows = result.data?.allVBeobArtChangeds?.nodes ?? []
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
      fileName: 'BeobachtungenArtVeraendert',
      store,
    })
  }, [enqueNotification, removeNotification, closeSnackbar, client, store])

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Beobachtungen</CardActionTitle>
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
            <DownloadCardButton onClick={onClickButton} color="inherit">
              <div>Alle Beobachtungen, bei denen die Art verändert wurde</div>
            </DownloadCardButton>
            <DownloadCardButton
              color="inherit"
              onClick={async () => {
                const notif = enqueNotification({
                  message: `Export "Beobachtungen" wird vorbereitet...`,
                  options: {
                    variant: 'info',
                    persist: true,
                  },
                })
                try {
                  const { data } = await client.query({
                    query: queryBeobZugeordnet,
                  })
                  exportModule({
                    data: data?.allVBeobs?.nodes ?? [],
                    fileName: 'Beobachtungen',
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
              }}
            >
              <div>Alle zugeordneten Beobachtungen</div>
            </DownloadCardButton>
            <DownloadCardButton
              color="inherit"
              onClick={async () => {
                const notif = enqueNotification({
                  message: `Export "Beobachtungen" wird vorbereitet...`,
                  options: {
                    variant: 'info',
                    persist: true,
                  },
                })
                try {
                  const { data } = await client.query({
                    query: queryBeobNichtZuzuordnen,
                  })
                  exportModule({
                    data: data?.allVBeobs?.nodes ?? [],
                    fileName: 'Beobachtungen',
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
              }}
            >
              <div>Alle nicht zuzuordnenden Beobachtungen</div>
            </DownloadCardButton>
          </StyledCardContent>
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default observer(Beobachtungen)
