import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import Select from '../../../../../shared/Select'
import Error from '../../../../../shared/Error'
import queryAdresses from './queryAdresses'
import storeContext from '../../../../../../storeContext'

const Container = styled.div`
  padding: 0 16px;
`

const EkfAdresse = ({ closeMenu }) => {
  const { data, error, loading } = useQuery(queryAdresses)
  const store = useContext(storeContext)
  const { setView, setEkfAdresseId } = store
  const choose = useCallback(
    async (event) => {
      closeMenu()
      // prevent this happening before seAnchor happened
      setTimeout(() => {
        setEkfAdresseId(event.target.value)
        setView('ekf')
      })
    },
    [closeMenu, setEkfAdresseId, setView],
  )

  if (loading) return '...'
  if (error) return <Error error={error} />

  return (
    <Container>
      <Select
        value={''}
        label="EKF sehen als"
        options={data?.allAdresses?.nodes ?? []}
        loading={loading}
        saveToDb={choose}
        maxHeight={120}
      />
    </Container>
  )
}

export default observer(EkfAdresse)
