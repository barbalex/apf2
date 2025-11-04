import { useContext, Suspense } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { query } from './query.js'
import { createUsermessage } from './createUsermessage.js'
import { MobxContext } from '../../mobxContext.js'
import { Error } from '../shared/Error.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { MessagesList } from './Messages/index.jsx'
import { a } from '../Projekte/Karte/layers/Pop/statusGroup/a.js'

const StyledDialog = styled(Dialog)`
  display: flex;
  flex-direction: column;
  > div > div {
    max-width: ${window.innerWidth * 0.8}px !important;
    min-width: 368px !important;
    min-width: 80% !important;
  }
`
const TitleRow = styled.div`
  padding-bottom: 5px;
  overflow: visible !important;
`
const AllOkButton = styled(Button)`
  position: absolute !important;
  top: 20px;
  right: 25px;
`

const getAYearAgo = () => {
  const now = new Date()
  now.setDate(now.getDate() - 365)
  return now.toISOString()
}

const aYearAgo = getAYearAgo()

export const Messages = observer(() => {
  const store = useContext(MobxContext)
  const { user } = store
  const userName = user.name

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  // DO NOT use aYearAgo in queryKey, because it changes every second
  // this causes the query to refetch all the time!
  const { data, error, refetch } = useQuery({
    queryKey: ['UsermessagesQuery', userName],
    queryFn: async () =>
      apolloClient.query({
        query,
        variables: { name: userName, aYearAgo },
        fetchPolicy: 'network-only',
      }),
  })
  // ensure username exists
  const userNames = (data?.data?.allUsers?.nodes ?? []).map((u) => u.name)
  const userNameExists = userNames.includes(userName)
  // DANGER: if no userName or non-existing, results are returned!
  const allMessages =
    userName && userNameExists ? (data?.data?.allMessages?.nodes ?? []) : []
  const unreadMessages = allMessages.filter(
    (m) => (m?.usermessagesByMessageId?.totalCount ?? 0) === 0,
  )

  const onClickReadAll = async () => {
    await Promise.all(
      unreadMessages.map(async (message) => {
        await apolloClient.mutate({
          mutation: createUsermessage,
          variables: { userName, id: message.id },
        })
      }),
    )
    return refetch()
  }

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <StyledDialog
          open={unreadMessages.length > 0 && !!userName}
          aria-labelledby="dialog-title"
        >
          <TitleRow>
            <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
            <AllOkButton
              onClick={onClickReadAll}
              color="inherit"
            >
              alle o.k.
            </AllOkButton>
          </TitleRow>
          <MessagesList unreadMessages={unreadMessages} />
        </StyledDialog>
      </Suspense>
    </ErrorBoundary>
  )
})
