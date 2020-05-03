import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const SecondLine = styled.span`
  margin-left: 15px;
`

// create objects outside render
const createNewPopFromBeobData = {
  action: 'createNewPopFromBeob',
}
const createNewTpopFromBeobData = {
  action: 'createNewTpopFromBeob',
}
const showCoordOfBeobOnMapsZhChData = {
  action: 'showCoordOfBeobOnMapsZhCh',
}
const showCoordOfBeobOnMapGeoAdminChData = {
  action: 'showCoordOfBeobOnMapGeoAdminCh',
}

const BeobNichtZuzuordnen = ({ treeName, onClick }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}beobNichtZuzuordnen`}>
        <div className="react-contextmenu-title">Beobachtung</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={createNewPopFromBeobData}>
              neue Population und Teil-Population gründen
              <br />
              <SecondLine>
                und Beobachtung der Teil-Population zuordnen
              </SecondLine>
            </MenuItem>
            <MenuItem onClick={onClick} data={createNewTpopFromBeobData}>
              neue Teil-Population in bestehender Population gründen
              <br />
              <SecondLine>
                und Beobachtung der Teil-Population zuordnen
              </SecondLine>
            </MenuItem>
          </>
        )}
        <MenuItem onClick={onClick} data={showCoordOfBeobOnMapsZhChData}>
          Zeige auf maps.zh.ch
        </MenuItem>
        <MenuItem onClick={onClick} data={showCoordOfBeobOnMapGeoAdminChData}>
          Zeige auf map.geo.admin.ch
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(BeobNichtZuzuordnen)
