import { useCallback } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useQuery as useTanstackQuery } from '@tanstack/react-query'

import constants from '../../../../modules/constants'
import exists from '../../../../modules/exists'
import query from './query'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const OuterContainer = styled.div`
  container-type: inline-size;
`
const Container = styled.div`
  padding: 15px 10px 0 10px;
  @container (min-width: ${constants.columnWidth * 1.6}px) {
    /* grid-template-columns: repeat(2, auto 1fr); */
  }
`
const Row = styled.div`
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-collapse: collapse;
`
const Label = styled.div`
  color: rgb(0, 0, 0, 0.54);
  width: 200px;
  padding: 5px;
  overflow-wrap: break-word;
`
const Value = styled.div`
  padding: 5px;
`

const sortedKeys = ['ESPECE', 'A_NOTE', 'M_NOTE', 'J_NOTE']

const sortFn = (a, b) => {
  const keyA = a[0]
  const keyB = b[0]
  const sortByA = sortedKeys.includes(keyA)
  const sortByB = sortedKeys.includes(keyB)

  if (sortByA && sortByB) {
    return sortedKeys.indexOf(keyA) - sortedKeys.indexOf(keyB)
  }
  if (sortByA || sortByB) {
    return 1
  }
  if (keyA?.toLowerCase?.() > keyB?.toLowerCase?.()) return 1
  if (keyA?.toLowerCase?.() < keyB?.toLowerCase?.()) return -1
  return 0
}

const Beob = () => {
  const { beobId: id } = useParams()
  const client = useApolloClient()

  const { data, isLoading, error } = useTanstackQuery({
    queryKey: ['beobByIdQueryForBeob', id],
    queryFn: async () =>
      client.query({
        query,
        variables: {
          id,
        },
      }),
  })

  const row = data?.data?.beobById ?? {}
  const rowData = row.data ? JSON.parse(row.data) : {}
  const fields = Object.entries(rowData)
    .filter(([key, value]) => exists(value))
    .sort(sortFn)

  // TODO: sort beobFields
  // console.log('Beob', { rowData, beobFields, loading })

  // const moveItem = useCallback((dragIndex, hoverIndex) => {
  //   setCards((prevCards) =>
  //     update(prevCards, {
  //       $splice: [
  //         [dragIndex, 1],
  //         [hoverIndex, 0, prevCards[dragIndex]],
  //       ],
  //     }),
  //   )
  // }, [])
  // const renderItem = useCallback(
  //   (field, index) => (
  //     <Row key={field.key} index={index} moveItem={moveItem}>
  //       <Label>{field.key}</Label>
  //       <Value>{field.value}</Value>
  //     </Row>
  //   ),
  //   [],
  // )

  if (!row) return null
  if (!fields || fields.length === 0) return null
  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <OuterContainer>
        <Container>
          <DndProvider backend={HTML5Backend}>
            {fields.map(([key, value]) => (
              <Row key={key}>
                <Label>{key}</Label>
                <Value>{value}</Value>
              </Row>
            ))}
          </DndProvider>
        </Container>
      </OuterContainer>
    </ErrorBoundary>
  )
}

export default observer(Beob)
