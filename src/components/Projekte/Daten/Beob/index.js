// @flow
import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const Beob = ({
  treeName,
  dimensions = { width: 380 },
}: {
  treeName: String,
  dimensions: Object,
}) => (
  <Query query={data1Gql}>
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const id = get(data, `${treeName}.activeNodeArray[5]`)

      return (
        <Query query={data2Gql} variables={{ id }}>
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
    }}
  </Query>
)

export default Beob
