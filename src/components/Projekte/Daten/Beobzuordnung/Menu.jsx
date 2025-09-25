import { memo, useCallback, useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { isEqual } from 'es-toolkit'

import { useSetAtom, useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
} from '../../../../JotaiStore/index.js'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { showCoordOfBeobOnMapsZhCh } from '../../../../modules/showCoordOfBeobOnMapsZhCh.js'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../../modules/showCoordOfBeobOnMapGeoAdminCh.js'
import { copyBeobZugeordnetKoordToTpop } from '../../../../modules/copyBeobZugeordnetKoordToTpop/index.js'
import { createNewPopFromBeob } from '../../../../modules/createNewPopFromBeob/index.js'
import { StyledLoadingButton, StyledButton } from '../Tpop/Menu.jsx'

export const Menu = memo(
  observer(() => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const { projId, apId, beobId, tpopId } = useParams()

    const store = useContext(MobxContext)

    const apolloClient = useApolloClient()

    const isBeobZugeordnet = !!tpopId
    const isBeobNichtBeurteilt =
      !tpopId && pathname.includes('nicht-beurteilte-Beobachtungen')
    const isBeobNichtZuzuordnen =
      !tpopId && pathname.includes('nicht-zuzuordnende-Beobachtungen')

    const [
      copyingBeobZugeordnetKoordToTpop,
      setCopyingBeobZugeordnetKoordToTpop,
    ] = useState(false)
    const onClickCopyingBeobZugeordnetKoordToTpop = useCallback(async () => {
      setCopyingBeobZugeordnetKoordToTpop(true)
      await copyBeobZugeordnetKoordToTpop({
        id: beobId,
        apolloClient,
        enqueNotification: store.enqueNotification,
      })
      setCopyingBeobZugeordnetKoordToTpop(false)
    }, [beobId, apolloClient, store])

    const onClickShowCoordOfBeobOnMapGeoAdminCh = useCallback(() => {
      showCoordOfBeobOnMapGeoAdminCh({
        id: beobId,
        apolloClient,
        enqueNotification: store.enqueNotification,
      })
    }, [beobId, apolloClient, store])

    const onClickShowCoordOfBeobOnMapsZhCh = useCallback(() => {
      showCoordOfBeobOnMapsZhCh({
        id: beobId,
        apolloClient,
        enqueNotification: store.enqueNotification,
      })
    }, [beobId, apolloClient, store])

    const [creatingNewPopFromBeob, setCreatingNewPopFromBeob] = useState(false)
    const onClickCreateNewPopFromBeob = useCallback(async () => {
      setCreatingNewPopFromBeob(true)
      await createNewPopFromBeob({
        id: beobId,
        apId,
        projId,
        apolloClient,
        store,
        search,
      })
      setTimeout(() => {
        setCreatingNewPopFromBeob(false)
      }, 500)
    }, [beobId, apId, projId, apolloClient, store, search])

    const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] = useAtom(
      newTpopFromBeobDialogOpenAtom,
    )
    const [newTpopFromBeobBeobId, setNewTpopFromBeobBeobId] = useAtom(
      newTpopFromBeobBeobIdAtom,
    )
    const closeNewTpopFromBeobDialog = useCallback(
      () => setNewTpopFromBeobDialogOpen(false),
      [],
    )
    const onClickNewTpopFromBeob = useCallback(() => {
      setNewTpopFromBeobBeobId(beobId)
      setNewTpopFromBeobDialogOpen(true)
    }, [beobId, setNewTpopFromBeobBeobId, setNewTpopFromBeobDialogOpen])

    // ISSUE: refs are sometimes/often not set on first render
    // trying to measure widths of menus leads to complete chaos
    // so passing in static widths instead

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${copyingBeobZugeordnetKoordToTpop}/${isBeobZugeordnet}/${isBeobNichtBeurteilt}/${creatingNewPopFromBeob}`}
        >
          {isBeobZugeordnet && (
            <StyledLoadingButton
              variant="outlined"
              onClick={onClickCopyingBeobZugeordnetKoordToTpop}
              loading={copyingBeobZugeordnetKoordToTpop}
              width={190}
            >
              Koordinaten auf die
              <br />
              Teilpopulation übertragen
            </StyledLoadingButton>
          )}
          {isBeobNichtBeurteilt && (
            <StyledLoadingButton
              variant="outlined"
              onClick={onClickCreateNewPopFromBeob}
              loading={creatingNewPopFromBeob}
              width={245}
            >
              {'Pop. und TPop. gründen >'}
              <br />
              {'Beobachtung der TPop. zuordnen'}
            </StyledLoadingButton>
          )}
          {isBeobNichtBeurteilt && (
            <StyledButton
              variant="outlined"
              onClick={onClickNewTpopFromBeob}
              width={258}
            >
              {'TPop. in bestehender Pop. gründen'}
              <br />
              {'> Beobachtung der TPop. zuordnen'}
            </StyledButton>
          )}
          <StyledButton
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapsZhCh}
            width={105}
          >
            zeige auf
            <br />
            maps.zh.ch
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapGeoAdminCh}
            width={147}
          >
            zeige auf
            <br />
            map.geo.admin.ch
          </StyledButton>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
