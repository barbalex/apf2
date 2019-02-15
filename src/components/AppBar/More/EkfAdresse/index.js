// @flow
import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import Select from '../../../shared/Select'
import query from './data'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  padding: 0 16px;
`

const EkfAdresse = ({ setAnchorEl }: { setAnchorEl: () => void }) => {
  const { data, error, loading } = useQuery(query)
  const { setView, setEkfAdresseId } = useContext(mobxStoreContext)
  const choose = useCallback(async event => {
    setAnchorEl(null)
    // prevent this happening before seAnchor happened
    setTimeout(() => {
      setEkfAdresseId(event.target.value)
      setView('ekf')
    })
  })

  let adressenWerte = get(data, 'allAdresses.nodes', [])
  adressenWerte = sortBy(adressenWerte, 'name')
  adressenWerte = adressenWerte.map(el => ({
    value: el.id,
    label: el.name,
  }))

  if (loading) return '...'
  if (error) return `Fehler in EKFAdresse: ${error.message}`

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

export default observer(EkfAdresse)
