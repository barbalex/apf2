import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import {
  userTokenAtom,
  copyingAtom,
  movingAtom,
} from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

// create objects outside render
const openLowerNodesData = {
  action: 'openLowerNodes',
}
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'tpop',
}
const deleteData = {
  action: 'delete',
  actionTable: 'tpop',
  table: 'tpop',
}
const localizeOnMapData = {
  action: 'localizeOnMap',
  actionTable: 'tpop',
  idTable: 'tpop',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'tpop',
}
const moveData = {
  action: 'move',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'tpop',
}
const copyData = {
  action: 'copy',
}
const resetCopyingData = {
  action: 'resetCopying',
}
const copyTpopKoordToPopData = {
  action: 'copyTpopKoordToPop',
}
const showCoordOfTpopOnMapsZhChData = {
  action: 'showCoordOfTpopOnMapsZhCh',
}
const showCoordOfTpopOnMapGeoAdminChData = {
  action: 'showCoordOfTpopOnMapGeoAdminCh',
}

export const Tpop = ({ onClick }) => {
  const moving = useAtomValue(movingAtom)
  const copying = useAtomValue(copyingAtom)
  const userToken = useAtomValue(userTokenAtom)

  const isMoving =
    moving.table &&
    ['tpopmassn', 'tpopfeldkontr', 'tpopfreiwkontr'].includes(moving.table)
  const isCopying =
    copying.table &&
    ['tpopmassn', 'tpopfeldkontr', 'tpopfreiwkontr'].includes(copying.table)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeTpop"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Teil-Population</div>
        <MenuItem
          onClick={onClick}
          data={openLowerNodesData}
        >
          alle öffnen
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={closeLowerNodesData}
        >
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(userToken) && (
          <>
            <MenuItem
              onClick={onClick}
              data={insertData}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={deleteData}
            >
              lösche
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={localizeOnMapData}
            >
              verorte auf Karte (mit Doppel-Klick)
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={markForMovingData}
            >
              verschiebe
            </MenuItem>
            {isMoving && (
              <MenuItem
                onClick={onClick}
                data={moveData}
              >
                {`verschiebe '${moving.label}' hierhin`}
              </MenuItem>
            )}
            <MenuItem
              onClick={onClick}
              data={markForCopyingData}
            >
              kopiere
            </MenuItem>
            {isCopying && (
              <MenuItem
                onClick={onClick}
                data={copyData}
              >
                {`kopiere '${copying.label}' hierhin`}
              </MenuItem>
            )}
            {isCopying && (
              <MenuItem
                onClick={onClick}
                data={resetCopyingData}
              >
                Kopieren aufheben
              </MenuItem>
            )}
            <MenuItem
              onClick={onClick}
              data={copyTpopKoordToPopData}
            >
              Kopiere Koordinaten in die Population
            </MenuItem>
          </>
        )}
        <MenuItem
          onClick={onClick}
          data={showCoordOfTpopOnMapsZhChData}
        >
          Zeige auf maps.zh.ch
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={showCoordOfTpopOnMapGeoAdminChData}
        >
          Zeige auf map.geo.admin.ch
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
}
