import { useCallback, useContext, useEffect } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useQuery } from '@tanstack/react-query'
import { arrayMoveImmutable } from 'array-move'

import constants from '../../../../modules/constants'
import exists from '../../../../modules/exists'
import query from './query'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import Beob from './Beob'
import storeContext from '../../../../storeContext'

const OuterContainer = styled.div`
  container-type: inline-size;
`
const Container = styled.div`
  padding: 15px 10px 0 10px;
  @container (min-width: ${constants.columnWidth * 1.7}px) {
    columns: 2;
  }
  @container (min-width: ${constants.columnWidth +
  constants.columnWidth * 1.7}px) {
    columns: 3;
  }
`

const BeobsComponent = () => {
  const { beobId: id } = useParams()
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { sortedBeobFields: sortedBeobFieldsPassed, setSortedBeobFields } =
    store
  const sortedBeobFields = sortedBeobFieldsPassed.slice()

  const sortFn = useCallback(
    (a, b) => {
      const keyA = a[0]
      const keyB = b[0]
      const indexOfA = sortedBeobFields.indexOf(keyA)
      const indexOfB = sortedBeobFields.indexOf(keyB)
      const sortByA = indexOfA > -1
      const sortByB = indexOfB > -1

      if (sortByA && sortByB) {
        return sortedBeobFields.indexOf(keyA) - sortedBeobFields.indexOf(keyB)
      }
      // if (sortByA || sortByB) {
      //   return 1
      // }
      if (keyA?.toLowerCase?.() > keyB?.toLowerCase?.()) return 1
      if (keyA?.toLowerCase?.() < keyB?.toLowerCase?.()) return -1
      return 0
    },
    [sortedBeobFields],
  )

  const { data, isLoading, error } = useQuery({
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
  const keys = fields.map((f) => f[0])

  useEffect(() => {
    // add missing keys to sortedBeobFields
    const additionalKeys = []
    for (const key of keys) {
      if (!sortedBeobFields.includes(key)) {
        additionalKeys.push(key)
      }
    }
    if (!additionalKeys.length) return
    setSortedBeobFields([...sortedBeobFields, ...additionalKeys])
    console.log('Beob, useEffect, adding additional keys: ', additionalKeys)
  }, [keys, setSortedBeobFields, sortedBeobFields])

  const moveField = useCallback(
    (dragIndex, hoverIndex) => {
      // get item from keys
      const itemBeingDragged = keys[dragIndex]
      const itemBeingHovered = keys[hoverIndex]
      // move from dragIndex to hoverIndex
      // in sortedBeobFields
      const fromIndex = sortedBeobFields.indexOf(itemBeingDragged)
      const toIndex = sortedBeobFields.indexOf(itemBeingHovered)
      // catch some edge cases
      if (fromIndex === toIndex) return
      if (fromIndex === -1) return
      if (toIndex === -1) return
      // move
      const newArray = arrayMoveImmutable(sortedBeobFields, fromIndex, toIndex)
      setSortedBeobFields(newArray)
    },
    [keys, setSortedBeobFields, sortedBeobFields],
  )
  const renderField = useCallback(
    (field, index) => (
      <Beob
        key={field[0]}
        label={field[0]}
        value={field[1]}
        index={index}
        moveField={moveField}
      />
    ),
    [moveField],
  )

  if (!row) return null
  if (!fields || fields.length === 0) return null
  if (isLoading) return <Spinner />
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <OuterContainer>
        <Container>
          <DndProvider backend={HTML5Backend}>
            {fields.map((field, i) => renderField(field, i))}
          </DndProvider>
        </Container>
      </OuterContainer>
    </ErrorBoundary>
  )
}

export default observer(BeobsComponent)
