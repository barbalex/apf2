import React from 'react'
import { observer } from 'mobx-react-lite'
import get from 'lodash/get'

const ApUser = ({ user }) => {
  return (
    <div>
      {user.userName}
      <span>{` (${(get(user, 'userByUserName.role') || '').replace(
        'apflora_',
        '',
      )})`}</span>
    </div>
  )
}

export default observer(ApUser)
