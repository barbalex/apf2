// @flow
/**
 * this is own component
 * because of the conditional query
 */
import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Query } from 'react-apollo'

import mobxStoreContext from '../../../mobxStoreContext'
import dataByUserNameGql from './dataByUserName'
import dataByAdresseIdGql from './dataByAdresseId'
import dataWithDateByUserNameGql from './dataWithDateByUserName'
import dataWithDateByAdresseIdGql from './dataWithDateByAdresseId'
import List from './List'

const EkfListContainer = ({ dimensions }: { dimensions: Object }) => {
  const { ekfYear, ekfAdresseId, user } = useContext(mobxStoreContext)

  let query = !!ekfAdresseId ? dataByAdresseIdGql : dataByUserNameGql
  const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
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

  return (
    <Query query={query} variables={variables}>
      {({ error, data, refetch, loading }) => {
        if (error) return `Fehler: ${error.message}`
        return <List data={data} loading={loading} dimensions={dimensions} />
      }}
    </Query>
  )
}

export default observer(EkfListContainer)
