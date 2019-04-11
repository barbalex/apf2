import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import Select from '../../../shared/Select'
import queryAdresses from './queryAdresses'
import storeContext from '../../../../storeContext'
import dealWithError from '../../../../modules/dealWithError'

const Container = styled.div`
  padding: 0 16px;
`

const EkfAdresse = ({ setAnchorEl }) => {
  const { data, error, loading } = useQuery(queryAdresses)
  const store = useContext(storeContext)
  const { setView, setEkfAdresseId } = store
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
    return dealWithError({ error, store, component: 'EKFAdresse' })
  }

  return (
    <Container>
      <Select
        value={''}
        label="EKF sehen als"
        options={get(data, 'allAdresses.nodes', [])}
        loading={loading}
        saveToDb={choose}
        maxHeight={130}
      />
    </Container>
  )
}

export default observer(EkfAdresse)
