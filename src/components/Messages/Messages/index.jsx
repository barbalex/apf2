import styled from '@emotion/styled'

import { Messages } from './Messages.jsx'

const ScrollContainer = styled.div`
  min-width: 80% !important;
  flex-grow: 1;
  overflow: auto;
  scrollbar-width: thin;
`

export const MessagesList = ({ unreadMessages }) => {
  return (
    <ScrollContainer>
      <Messages unreadMessages={unreadMessages} />
    </ScrollContainer>
  )
}
