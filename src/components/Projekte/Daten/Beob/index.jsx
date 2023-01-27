import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { useResizeDetector } from 'react-resize-detector'
import { useParams } from 'react-router-dom'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import exists from '../../../../modules/exists'
import query from './query'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
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

  const { width = 500, ref: resizeRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
    refreshOptions: { leading: true },
  })

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (!row) return null
  if (!beobFields || beobFields.length === 0) return null
  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div ref={resizeRef}>
        <Container data-column-width={columnWidth}>
          {beobFields.map(([key, value]) => (
            <div key={key}>
              <TextFieldNonUpdatable label={key} value={value} />
            </div>
          ))}
        </Container>
      </div>
    </ErrorBoundary>
  )
}

export default observer(Beob)
