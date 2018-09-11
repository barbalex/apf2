// @flow
import React, { createRef, Component } from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

type Props = {
  treeName: String,
  id: String,
  dimensions: Object,
}

class Beob extends Component<Props> {
  constructor(props) {
    super(props)
    // TODO: what is this ref used for?
    this.container = createRef()
  }

  render() {
    const { id, dimensions = { width: 380 } } = this.props

    return (
      <Query query={dataGql} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <Container>Lade...</Container>
          if (error) return `Fehler: ${error.message}`

          const row = get(data, 'beobById')
          if (!row) return null

          const beobFields = Object.entries(JSON.parse(row.data)).filter(
            ([key, value]) => value || value === 0 || value === false
          )
          if (!beobFields || beobFields.length === 0) return null

          return (
            <ErrorBoundary>
              <div ref={this.container}>
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
  }
}

export default Beob
