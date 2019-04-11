// @flow
/**
 * this is own component
 * because of the conditional query
 */
import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import storeContext from '../../../storeContext'
import dataByUserNameGql from './dataByUserName'
import dataByAdresseIdGql from './dataByAdresseId'
import dataWithDateByUserNameGql from './dataWithDateByUserName'
import dataWithDateByAdresseIdGql from './dataWithDateByAdresseId'
import List from './List'
import dealWithError from '../../../modules/dealWithError'

const EkfListContainer = () => {
  const mobxStore = useContext(storeContext)
  const { ekfYear, ekfAdresseId, user } = mobxStore

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
    return dealWithError({ error, mobxStore, component: 'ListContainer' })
  }
  return <List data={data} loading={loading} />
}

export default observer(EkfListContainer)
