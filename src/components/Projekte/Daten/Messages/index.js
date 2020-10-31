import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { useQuery } from '@apollo/client'
import Linkify from 'react-linkify'
import { DateTime } from 'luxon'
import SimpleBar from 'simplebar-react'

import query from './query'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import storeContext from '../../../../storeContext'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const ScrollContainer = styled.div`
  height: calc(100% - 43px);
`
const FieldsContainer = styled.div`
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

const Messages = () => {
  const store = useContext(storeContext)
  const { appBarHeight } = store

  const { data, loading, error } = useQuery(query)

  const rows = get(data, 'allMessages.nodes') || []

  if (loading)
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
        <TitleRow>
          <Title data-id="form-title">Mitteilungen</Title>
        </TitleRow>
        <ScrollContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FieldsContainer>
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
            </FieldsContainer>
          </SimpleBar>
        </ScrollContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default Messages
