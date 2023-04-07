import { useCallback, useContext, useEffect } from 'react'
import styled from '@emotion/styled'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useQuery } from '@tanstack/react-query'
import { arrayMoveImmutable } from 'array-move'

import exists from '../../../../../modules/exists'
import ErrorBoundary from '../../../../shared/ErrorBoundary'
import Error from '../../../../shared/Error'
import Spinner from '../../../../shared/Spinner'
import Beob from './Field'
import storeContext from '../../../../../storeContext'
import { beob } from '../../../../shared/fragments'

const Container = styled.div`
  margin-left: -10px;
  margin-right: -10px;
`
const StyledAccordion = styled(Accordion)``
const StyledAccordionSummary = styled(AccordionSummary)`
  margin: 0;
  padding: 0 10px;
  min-height: 28px;
  > div {
    margin: 0;
  }
`
const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 4px 8px;
`

const BeobData = ({ id }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const {
    sortedBeobFieldsForMap: sortedBeobFieldsForMapPassed,
    sortedBeobFields: sortedBeobFieldsPassed,
    setSortedBeobFieldsForMap,
  } = store

  const { setBeobDetailsOpen, beobDetailsOpen } = store.map
  const onClickDetails = useCallback(
    (event) => {
      console.log('onClickDetails', event)
      setBeobDetailsOpen(!beobDetailsOpen)
    },
    [beobDetailsOpen, setBeobDetailsOpen],
  )

  // use existing sorting if available and no own has been set yet
  const sortedBeobFieldsForMap = sortedBeobFieldsForMapPassed.slice()
  const sortedBeobFields = sortedBeobFieldsPassed.slice()
  const sortedBeobFieldsToUse = sortedBeobFieldsForMap.length
    ? sortedBeobFieldsForMap
    : sortedBeobFields

  const sortFn = useCallback(
    (a, b) => {
      const keyA = a[0]
      const keyB = b[0]
      const indexOfA = sortedBeobFieldsToUse.indexOf(keyA)
      const indexOfB = sortedBeobFieldsToUse.indexOf(keyB)
      const sortByA = indexOfA > -1
      const sortByB = indexOfB > -1

      if (sortByA && sortByB) {
        return (
          sortedBeobFieldsToUse.indexOf(keyA) -
          sortedBeobFieldsToUse.indexOf(keyB)
        )
      }
      // if (sortByA || sortByB) {
      //   return 1
      // }
      if (keyA?.toLowerCase?.() > keyB?.toLowerCase?.()) return 1
      if (keyA?.toLowerCase?.() < keyB?.toLowerCase?.()) return -1
      return 0
    },
    [sortedBeobFieldsToUse],
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['beobByIdQueryForBeob', id],
    queryFn: async () =>
      client.query({
        query: gql`
          query beobByIdQueryForBeobLayer($id: UUID!) {
            beobById(id: $id) {
              ...BeobFields
            }
          }
          ${beob}
        `,
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
      if (!sortedBeobFieldsToUse.includes(key)) {
        additionalKeys.push(key)
      }
    }
    if (!additionalKeys.length) return
    setSortedBeobFieldsForMap([...sortedBeobFieldsToUse, ...additionalKeys])
    console.log('Beob, useEffect, adding additional keys: ', additionalKeys)
  }, [keys, setSortedBeobFieldsForMap, sortedBeobFieldsToUse])

  const moveField = useCallback(
    (dragIndex, hoverIndex) => {
      // get item from keys
      const itemBeingDragged = keys[dragIndex]
      const itemBeingHovered = keys[hoverIndex]
      // move from dragIndex to hoverIndex
      // in sortedBeobFields
      const fromIndex = sortedBeobFieldsToUse.indexOf(itemBeingDragged)
      const toIndex = sortedBeobFieldsToUse.indexOf(itemBeingHovered)
      // catch some edge cases
      if (fromIndex === toIndex) return
      if (fromIndex === -1) return
      if (toIndex === -1) return
      // move
      const newArray = arrayMoveImmutable(
        sortedBeobFieldsToUse,
        fromIndex,
        toIndex,
      )
      setSortedBeobFieldsForMap(newArray)
    },
    [keys, setSortedBeobFieldsForMap, sortedBeobFieldsToUse],
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
      <Container>
        <StyledAccordion
          expanded={beobDetailsOpen}
          onChange={onClickDetails}
          disableGutters
          elevation={1}
        >
          <StyledAccordionSummary>Daten</StyledAccordionSummary>
          <StyledAccordionDetails>
            <DndProvider backend={HTML5Backend}>
              {fields.map((field, i) => renderField(field, i))}
            </DndProvider>
          </StyledAccordionDetails>
        </StyledAccordion>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(BeobData)
