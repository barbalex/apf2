// @flow
import React, { useCallback, useContext } from 'react'
import compose from 'recompose/compose'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { withApollo } from 'react-apollo'
import { observer } from 'mobx-react-lite'

import Select from '../../../shared/Select'
import withData from './withData'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  padding: 0 16px;
`

const enhance = compose(
  withApollo,
  withData,
  observer,
)

const EkfAdresse = ({
  data,
  client,
  setAnchorEl,
}: {
  data: Object,
  client: Object,
  setAnchorEl: () => void,
}) => {
  const { setView, setEkfAdresseId } = useContext(mobxStoreContext)
  const choose = useCallback(async event => {
    setAnchorEl(null)
    // prevent this happening before seAnchor happened
    setTimeout(() => {
      setEkfAdresseId(event.target.value)
      setView('ekf')
    })
  })

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
