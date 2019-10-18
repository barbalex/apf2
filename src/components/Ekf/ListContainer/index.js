/**
 * this is own component
 * because of the conditional query
 */
import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'

import storeContext from '../../../storeContext'
import dataByUserNameGql from './dataByUserName'
import dataByAdresseIdGql from './dataByAdresseId'
import dataWithDateByUserNameGql from './dataWithDateByUserName'
import dataWithDateByAdresseIdGql from './dataWithDateByAdresseId'
import List from './List'
import Error from '../../shared/Error'

const EkfListContainer = () => {
  const store = useContext(storeContext)
  const { ekfYear, ekfAdresseId, user } = store

  let query = !!ekfAdresseId ? dataByAdresseIdGql : dataByUserNameGql
  const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()
  if (ekfRefYear !== ekfYear) {
    query = !!ekfAdresseId
      ? dataWithDateByAdresseIdGql
      : dataWithDateByUserNameGql
  }
  const { name: userName } = user
  const variables = ekfAdresseId
    ? { id: ekfAdresseId, jahr: ekfYear }
    : { userName, jahr: ekfYear }

  const { data, loading, error } = useQuery(query, {
    variables,
  })

  if (error) {
    const errors = [error]
    console.log('ListContainer, error:', error.message)
    return <Error errors={errors} />
  }
  return <List data={data} loading={loading} />
}

export default observer(EkfListContainer)
