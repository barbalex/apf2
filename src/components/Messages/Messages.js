import React, { useCallback, useContext } from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Linkify from 'react-linkify'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { DateTime } from 'luxon'
import SimpleBar from 'simplebar-react'
import { withResizeDetector } from 'react-resize-detector'

import createUsermessage from './createUsermessage'
import storeContext from '../../storeContext'

const ScrollContainer = styled.div`
  height: ${(props) => `${props['data-height']}px`};
`
const MessageRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${(props) => (props.paddBottom ? '24px' : 0)};
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

const UserMessages = ({ unreadMessages, height = 800 }) => {
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
    <ScrollContainer data-height={height}>
      <SimpleBar
        style={{
          maxHeight: '100%',
          height: '100%',
        }}
      >
        {unreadMessages.map((m, index) => {
          const paddBottom = index === unreadMessages.length - 1
          const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

          return (
            <MessageRow key={m.id} paddBottom={paddBottom}>
              <Linkify properties={{ target: '_blank' }}>
                <MessageDiv>{`${date}: ${m.message}`}</MessageDiv>
              </Linkify>
              <OkButton onClick={() => onClickRead(m)}>o.k.</OkButton>
            </MessageRow>
          )
        })}
      </SimpleBar>
    </ScrollContainer>
  )
}

export default withResizeDetector(observer(UserMessages))
