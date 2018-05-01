// @flow
import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import beobByIdGql from './beobById.graphql'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const Beob = ({
  id,
  dimensions = { width: 380 },
}: {
  id: String,
  dimensions: Object,
}) => (
  <Query query={beobByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return <Container>Lade...</Container>
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'beobById')
      if (!row) return null

      const beobFields = Object.entries(JSON.parse(row.data)).filter(
        ([key, value]) => value || value === 0
      )
      if (!beobFields || beobFields.length === 0) return null

      return (
        <ErrorBoundary>
          <div ref={c => (this.container = c)}>
            <Container
              data-width={isNaN(dimensions.width) ? 380 : dimensions.width}
            >
              {beobFields.map(([key, value]) => (
                <div key={key}>
                  <TextFieldNonUpdatable label={key} value={value} />
                </div>
              ))}
            </Container>
          </div>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default Beob
