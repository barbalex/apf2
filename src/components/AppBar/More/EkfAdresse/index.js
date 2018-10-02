// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import app from 'ampersand-app'

import Select from '../../../shared/Select'
import dataGql from './data'
import setViewGql from './setView'
import setEkfAdresseIdGql from './setEkfAdresseId'

const Container = styled.div`
  padding: 0 16px;
`

const enhance = compose(
  withHandlers({
    choose: ({ setAnchorEl }: { setAnchorEl: () => void }) => async id => {
      const { client } = app
      await client.mutate({
        mutation: setEkfAdresseIdGql,
        variables: { value: id },
      })
      await client.mutate({
        mutation: setViewGql,
        variables: { value: 'ekf' },
      })
      setAnchorEl(null)
    },
  }),
)

const EkfAdresse = ({ choose }: { choose: () => void }) => (
  <Query query={dataGql}>
    {({ loading, error, data }) => {
      if (loading) return '...'
      if (error) return `Fehler: ${error.message}`
      let adressenWerte = get(data, 'allAdresses.nodes', [])
      adressenWerte = sortBy(adressenWerte, 'name')
      adressenWerte = adressenWerte.map(el => ({
        value: el.id,
        label: el.name,
      }))

      return (
        <Container>
          <Select
            value={''}
            label="EKF sehen als"
            options={adressenWerte}
            saveToDb={choose}
            maxHeight={130}
          />
        </Container>
      )
    }}
  </Query>
)

export default enhance(EkfAdresse)
