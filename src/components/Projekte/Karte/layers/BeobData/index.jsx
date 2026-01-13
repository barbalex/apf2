import { useContext, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useQuery } from '@tanstack/react-query'
import { arrayMoveImmutable } from 'array-move'

import { exists } from '../../../../../modules/exists.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../../shared/Error.jsx'
import { Spinner } from '../../../../shared/Spinner.jsx'
import { Field } from './Field.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { beob } from '../../../../shared/fragments.js'

import markerStyles from '../BeobNichtBeurteilt/Marker.module.css'
import styles from './index.module.css'

const topFieldNames = [
  'PRESENCE',
  'presence',
  'XY_PRECISION',
  'xy_radius',
  'locality_descript',
]

export const Data = observer(({ id }) => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)
  const { sortedBeobFields: sortedBeobFieldsPassed, setSortedBeobFields } =
    store

  const { setBeobDetailsOpen, beobDetailsOpen } = store.map
  const onClickDetails = (event) => setBeobDetailsOpen(!beobDetailsOpen)

  // use existing sorting if available and no own has been set yet
  const sortedBeobFields = sortedBeobFieldsPassed.slice()

  const sortFn = (a, b) => {
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
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['beobByIdQueryForBeob', id],
    queryFn: async () =>
      apolloClient.query({
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
        fetchPolicy: 'no-cache',
      }),
  })

  const row = data?.data?.beobById ?? {}
  const rowData = row.data ? JSON.parse(row.data) : {}

  const topFields = Object.entries(rowData)
    .filter(([key, value]) => exists(value))
    .filter(([key]) => topFieldNames.includes(key))
    .sort(sortFn)

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
    // console.log('Beob, useEffect, adding additional keys: ', additionalKeys)
  }, [keys, setSortedBeobFields, sortedBeobFields])

  const moveField = (dragIndex, hoverIndex) => {
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
  }

  const renderField = (field, index) => (
    <Field
      key={field[0]}
      label={field[0]}
      value={field[1]}
      index={index}
      moveField={moveField}
    />
  )

  if (!row) return null
  if (!fields || fields.length === 0) return null
  if (isLoading) return <Spinner />
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      {!!topFields.length && (
        <div className={styles.topFieldsContainer}>
          <div className={markerStyles.info}>
            {topFields.map(([key, value]) => {
              const isAbsenz =
                key?.toLowerCase?.()?.includes?.('presence') && row?.absenz

              return (
                <div
                  key={key}
                  className={isAbsenz ? markerStyles.absenz : ''}
                >
                  <div>{`${key}:`}</div>
                  <div>{value}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className={styles.dataContainer}>
        <Accordion
          expanded={beobDetailsOpen}
          onChange={onClickDetails}
          disableGutters
          elevation={1}
        >
          <AccordionSummary className={styles.dataSummary}>
            Daten
          </AccordionSummary>
          <AccordionDetails className={styles.dataDetails}>
            <DndProvider
              backend={HTML5Backend}
              context={window}
            >
              {fields.map((field, i) => renderField(field, i))}
            </DndProvider>
          </AccordionDetails>
        </Accordion>
      </div>
    </ErrorBoundary>
  )
})
