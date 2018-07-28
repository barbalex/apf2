// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import Autocomplete from '../../../shared/Autocomplete'
import dataGql from './data.graphql'

const Container = styled.div`
  padding: 0 16px;
`

const enhance = compose(
  withHandlers({
    choose: ({ setStateValue }) => event => setStateValue(event.target.value),
  })
)

const EkfAdresse = ({ choose }: { choose: () => void }) => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (loading) return '...'
      if (error) return `Fehler: ${error.message}`
      let adressenWerte = get(data, 'allAdresses.nodes', [])
      adressenWerte = sortBy(adressenWerte, 'name')
      adressenWerte = adressenWerte.map(el => ({
        id: el.id,
        value: el.name,
      }))

      return (
        <Container>
          <Autocomplete
            label="EKF sehen als"
            value={''}
            objects={adressenWerte}
            saveToDb={value => console.log('TODO, value:', value)}
            suggestionsListMaxHeight={150}
          />
        </Container>
      )
    }}
  </Query>
)

export default enhance(EkfAdresse)
