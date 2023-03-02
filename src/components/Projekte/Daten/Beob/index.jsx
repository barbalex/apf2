import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
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
  @container (min-width: ${constants.columnWidth}px) {
    column-width: ${constants.columnWidth}px;
  }
`

const Beob = () => {
  const { beobId: id } = useParams()

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })
  const row = data?.beobById ?? {}
  const beobFields = row.data
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(JSON.parse(row.data)).filter(([key, value]) =>
        exists(value),
      )
    : []

  //console.log('Beob', { row, beobFields, data, loading, error })

  if (!row) return null
  if (!beobFields || beobFields.length === 0) return null
  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <OuterContainer>
        <Container>
          {beobFields.map(([key, value]) => (
            <div key={key}>
              <TextFieldNonUpdatable label={key} value={value} />
            </div>
          ))}
        </Container>
      </OuterContainer>
    </ErrorBoundary>
  )
}

export default observer(Beob)
