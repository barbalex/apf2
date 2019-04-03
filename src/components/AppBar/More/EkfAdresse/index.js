// @flow
import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import Select from '../../../shared/Select'
import queryAdresses from './queryAdresses'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import mobxStoreContext from '../../../../mobxStoreContext'
import dealWithError from '../../../../modules/dealWithError'

const Container = styled.div`
  padding: 0 16px;
`

const EkfAdresse = ({ setAnchorEl }: { setAnchorEl: () => void }) => {
  const { data, error, loading } = useQuery(queryAdresses)
  const mobxStore = useContext(mobxStoreContext)
  const { setView, setEkfAdresseId } = mobxStore
  const choose = useCallback(async event => {
    setAnchorEl(null)
    // prevent this happening before seAnchor happened
    setTimeout(() => {
      setEkfAdresseId(event.target.value)
      setView('ekf')
    })
  })

  if (loading) return '...'
  if (error) {
    return dealWithError({ error, mobxStore, component: 'EKFAdresse' })
  }

  return (
    <Container>
      <ErrorBoundary>
        <Select
          value={''}
          label="EKF sehen als"
          options={get(data, 'allAdresses.nodes', [])}
          loading={loading}
          saveToDb={choose}
          maxHeight={130}
        />
      </ErrorBoundary>
    </Container>
  )
}

export default observer(EkfAdresse)
