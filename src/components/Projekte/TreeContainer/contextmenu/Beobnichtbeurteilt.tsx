import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { userTokenAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import styles from './Beobnichtbeurteilt.module.css'

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

export const BeobNichtBeurteilt = ({ onClick }) => {
  const userToken = useAtomValue(userTokenAtom)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeBeobNichtBeurteilt"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Beobachtung</div>
        {!userIsReadOnly(userToken) && (
          <>
            <MenuItem
              onClick={onClick}
              data={createNewPopFromBeobData}
            >
              neue Population und Teil-Population gründen
              <br />
              <span className={styles.secondLine}>
                und Beobachtung der Teil-Population zuordnen
              </span>
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={createNewTpopFromBeobData}
            >
              neue Teil-Population in bestehender Population gründen
              <br />
              <span className={styles.secondLine}>
                und Beobachtung der Teil-Population zuordnen
              </span>
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
}
