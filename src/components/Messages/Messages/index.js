import React from 'react'
import styled from '@emotion/styled'

import Messages from './Messages'

const ScrollContainer = styled.div`
  min-width: 80% !important;
  flex-grow: 1;
  overflow: auto;
`

const UserMessages = ({ unreadMessages }) => {
  return (
    <ScrollContainer>
      <Messages unreadMessages={unreadMessages} />
    </ScrollContainer>
  )
}

export default UserMessages
