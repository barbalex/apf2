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
import queryBeobZugeordnet from './queryBeobZugeordnet'
import queryBeobNichtZuzuordnen from './queryBeobNichtZuzuordnen'
import allVBeobArtChangeds from './allVBeobArtChangeds'
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

const Beobachtungen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    exportApplyMapFilter,
    exportFileType,
    enqueNotification,
    removeNotification,
  } = store

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
    try {
      const { data } = await client.query({
        query: allVBeobArtChangeds,
      })
      exportModule({
        data: get(data, 'allVBeobArtChangeds.nodes', []),
        fileName: 'BeobachtungenArtVeraendert',
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
        <CardActionTitle>Beobachtungen</CardActionTitle>
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
          <DownloadCardButton onClick={onClickButton}>
            <div>Alle Beobachtungen, bei denen die Art verändert wurde</div>
          </DownloadCardButton>
          <DownloadCardButton
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
                  data: get(data, 'allVBeobs.nodes', []),
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
                  data: get(data, 'allVBeobs.nodes', []),
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
      </Collapse>
    </StyledCard>
  )
}

export default observer(Beobachtungen)
