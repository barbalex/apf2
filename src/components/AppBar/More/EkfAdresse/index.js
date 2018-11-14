// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import app from 'ampersand-app'

import Select from '../../../shared/Select'
import withData from './withData'
import setViewGql from './setView'
import setEkfAdresseIdGql from './setEkfAdresseId'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  padding: 0 16px;
`

const enhance = compose(
  withData,
  withHandlers({
    choose: ({ setAnchorEl }: { setAnchorEl: () => void }) => async event => {
      const id = event.target.value
      const { client } = app
      client.mutate({
        mutation: setEkfAdresseIdGql,
        variables: { value: id },
      })
      client.mutate({
        mutation: setViewGql,
        variables: { value: 'ekf' },
      })
      setAnchorEl(null)
    },
  }),
)

const EkfAdresse = ({ choose, data }: { choose: () => void, data: Object }) => {
  if (data.loading) return '...'
  if (data.error) return `Fehler: ${data.error.message}`
  let adressenWerte = get(data, 'allAdresses.nodes', [])
  adressenWerte = sortBy(adressenWerte, 'name')
  adressenWerte = adressenWerte.map(el => ({
    value: el.id,
    label: el.name,
  }))

  return (
    <Container>
      <ErrorBoundary>
        <Select
          value={''}
          label="EKF sehen als"
          options={adressenWerte}
          saveToDb={choose}
          maxHeight={130}
        />
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(EkfAdresse)
