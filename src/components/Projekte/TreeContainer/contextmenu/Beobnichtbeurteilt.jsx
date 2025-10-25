import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

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

export const BeobNichtBeurteilt = observer(({ onClick }) => {
  const { user } = useContext(MobxContext)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeBeobNichtBeurteilt"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Beobachtung</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem
              onClick={onClick}
              data={createNewPopFromBeobData}
            >
              neue Population und Teil-Population gründen
              <br />
              <SecondLine>
                und Beobachtung der Teil-Population zuordnen
              </SecondLine>
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={createNewTpopFromBeobData}
            >
              neue Teil-Population in bestehender Population gründen
              <br />
              <SecondLine>
                und Beobachtung der Teil-Population zuordnen
              </SecondLine>
            </MenuItem>
          </>
        )}
        <MenuItem
          onClick={onClick}
          data={showCoordOfBeobOnMapsZhChData}
        >
          Zeige auf maps.zh.ch
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={showCoordOfBeobOnMapGeoAdminChData}
        >
          Zeige auf map.geo.admin.ch
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
})
