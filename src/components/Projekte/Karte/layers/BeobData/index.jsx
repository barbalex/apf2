import { useCallback, useMemo, useContext, useEffect } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import exists from '../../../../../modules/exists'
import ErrorBoundary from '../../../../shared/ErrorBoundary'
import Error from '../../../../shared/Error'
import Spinner from '../../../../shared/Spinner'
import storeContext from '../../../../../storeContext'
import { beob } from '../../../../shared/fragments'
import { Info } from '../BeobZugeordnet/Marker'
import List from './List'

const TopFieldContainer = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
`

const topFieldNames = [
  'PRESENCE',
  'presence',
  'XY_PRECISION',
  'xy_radius',
  'locality_descript',
]

const BeobData = ({ id }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { sortedBeobFields: sortedBeobFieldsPassed, setSortedBeobFields } =
    store

  // use existing sorting if available and no own has been set yet
  const sortedBeobFields = sortedBeobFieldsPassed.slice()

  console.log('Beob, sortedBeobFields:', sortedBeobFields)

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
  const rowData = useMemo(
    () => (row.data ? JSON.parse(row.data) : {}),
    [row.data],
  )

  const topFields = useMemo(
    () =>
      Object.entries(rowData)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        .filter(([key, value]) => exists(value))
        .filter(([key]) => topFieldNames.includes(key))
        .sort(sortFn),
    [rowData, sortFn],
  )

  const fields = useMemo(
    () =>
      Object.entries(rowData)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        .filter(([key, value]) => exists(value))
        .sort(sortFn),
    [rowData, sortFn],
  )
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
  }, [keys, setSortedBeobFields, sortedBeobFields])

  if (!row) return null
  if (!fields || fields.length === 0) return null
  if (isLoading) return <Spinner />
  if (error) return <Error error={error} />

  console.log('Beob, render, fields:', fields)

  return (
    <ErrorBoundary>
      {!!topFields.length && (
        <TopFieldContainer>
          <Info>
            {topFields.map(([key, value]) => (
              <>
                <div>{`${key}:`}</div>
                <div>{value}</div>
              </>
            ))}
          </Info>
        </TopFieldContainer>
      )}
      <List fields={fields} />
    </ErrorBoundary>
  )
}

export default observer(BeobData)
