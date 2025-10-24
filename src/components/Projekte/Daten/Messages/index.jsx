import styled from '@emotion/styled'
import { useQuery } from '@apollo/client/react'
import Linkify from 'react-linkify'
import { DateTime } from 'luxon'

import { query } from './query.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const ScrollContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
  height: 100%;
`
const MessageRow = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: solid #f0f0f0;
`
const Date = styled.div`
  flex-basis: 110px;
  flex-shrink: 0;
`
const Message = styled.div``
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #388e3c;
  padding-bottom: 10px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: white;
  font-weight: bold;
`

export const Component = () => {
  const { data, loading, error } = useQuery(query)

  const rows = data?.allMessages?.nodes ?? []

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <TitleRow>
          <Title data-id="form-title">Mitteilungen</Title>
        </TitleRow>
        <ScrollContainer>
          {rows.map((m) => {
            const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

            return (
              <MessageRow key={m.id}>
                <Date>{date}</Date>
                <Message>
                  <Linkify properties={{ target: '_blank' }}>
                    {m.message}
                  </Linkify>
                </Message>
              </MessageRow>
            )
          })}
        </ScrollContainer>
      </Container>
    </ErrorBoundary>
  )
}
