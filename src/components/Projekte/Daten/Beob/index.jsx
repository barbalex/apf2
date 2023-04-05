import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

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
  display: grid;
  div {
    padding: 5px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    border-collapse: collapse;
  }
  grid-template-columns: repeat(1, auto 1fr);
  .label {
    color: rgb(0, 0, 0, 0.54);
  }
  /* div:nth-of-type(4n + 2),
  div:nth-of-type(4n + 1) {
    background-color: rgba(0, 0, 0, 0.03);
  } */
  @container (min-width: ${constants.columnWidth * 1.6}px) {
    grid-template-columns: repeat(2, auto 1fr);
    /* div:nth-of-type(n + 4),
    div:nth-of-type(n + 3) {
      background-color: rgba(0, 0, 0, 0.03);
    } */
  }
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

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })
  const row = data?.beobById ?? {}
  const rowData = row.data ? JSON.parse(row.data) : {}
  const beobFields = Object.entries(rowData)
    .filter(([key, value]) => exists(value))
    .sort(sortFn)

  // TODO: sort beobFields
  // console.log('Beob', { rowData, beobFields, loading })

  if (!row) return null
  if (!beobFields || beobFields.length === 0) return null
  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <OuterContainer>
        <Container>
          {beobFields.map(([key, value]) => (
            <>
              <div className="label" key={key}>
                {key}
              </div>
              <div>{value}</div>
            </>
          ))}
        </Container>
      </OuterContainer>
    </ErrorBoundary>
  )
}

export default observer(Beob)
