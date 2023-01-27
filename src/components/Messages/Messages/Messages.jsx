import React, { useCallback, useContext } from 'react'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import Linkify from 'react-linkify' 
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { DateTime } from 'luxon'

import createUsermessage from '../createUsermessage'
import storeContext from '../../../storeContext'

const Container = styled.div`
  height: 100%;
`
const MessageRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${(props) => (props.paddBottom ? '24px' : '7px')};
  border-top: 1px solid #cacaca;
  padding-left: 24px;
  padding-right: 15px;
  min-height: 36px;
`
const MessageDiv = styled.div`
  padding-top: 8px;
  padding-right: 15px;
`
const OkButton = styled(Button)`
  position: relative !important;
  right: 12px;
`

const UserMessages = ({ unreadMessages }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { user } = store
  const userName = user.name

  const onClickRead = useCallback(
    async (message) => {
      await client.mutate({
        mutation: createUsermessage,
        variables: { userName, id: message.id },
        refetchQueries: ['UsermessagesQuery'],
      })
    },
    [client, userName],
  )

  return (
    <Container>
      {unreadMessages.map((m, index) => {
        const paddBottom = index === unreadMessages.length - 1
        const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

        return (
          <MessageRow key={m.id} paddBottom={paddBottom}>
            <Linkify properties={{ target: '_blank' }}>
              <MessageDiv>{`${date}: ${m.message}`}</MessageDiv>
            </Linkify>
            <OkButton onClick={() => onClickRead(m)} color="inherit">
              o.k.
            </OkButton>
          </MessageRow>
        )
      })}
    </Container>
  )
}

export default observer(UserMessages)
