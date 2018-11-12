// @flow
import React, { createRef, Component } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(withData)

type Props = {
  treeName: String,
  id: String,
  dimensions: Object,
  data: Object,
}

class Beob extends Component<Props> {
  constructor(props) {
    super(props)
    // TODO: what is this ref used for?
    this.container = createRef()
  }

  render() {
    const { data, dimensions = { width: 380 } } = this.props

    if (data.loading) return <Container>Lade...</Container>
    if (data.error) return `Fehler: ${data.error.message}`

    const row = get(data, 'beobById', {})
    if (!row) return null

    const beobFields = Object.entries(JSON.parse(row.data)).filter(
      ([key, value]) => value || value === 0 || value === false,
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
  }
}

export default enhance(Beob)
