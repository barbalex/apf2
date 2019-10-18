import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'

import Select from '../../../../../shared/Select'
import Error from '../../../../../shared/Error'
import queryAdresses from './queryAdresses'
import storeContext from '../../../../../../storeContext'

const Container = styled.div`
  padding: 0 16px;
`

const EkfAdresse = ({ setAnchorEl }) => {
  const { data, error, loading } = useQuery(queryAdresses)
  const store = useContext(storeContext)
  const { setView, setEkfAdresseId } = store
  const choose = useCallback(
    async event => {
      setAnchorEl(null)
      // prevent this happening before seAnchor happened
      setTimeout(() => {
        setEkfAdresseId(event.target.value)
        setView('ekf')
      })
    },
    [setAnchorEl, setEkfAdresseId, setView],
  )

  if (loading) return '...'
  if (error) {
    const errors = [error]
    console.log('AppBar More EkfAdresse, error:', error.message)
    return <Error errors={errors} />
  }

  return (
    <Container>
      <Select
        value={''}
        label="EKF sehen als"
        options={get(data, 'allAdresses.nodes', [])}
        loading={loading}
        saveToDb={choose}
        maxHeight={120}
      />
    </Container>
  )
}

export default observer(EkfAdresse)
