import {
  memo,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

import { useSetAtom, useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
} from '../../../../JotaiStore/index.js'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { showCoordOfBeobOnMapsZhCh } from '../../../../modules/showCoordOfBeobOnMapsZhCh.js'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../../modules/showCoordOfBeobOnMapGeoAdminCh.js'
import { copyBeobZugeordnetKoordToTpop } from '../../../../modules/copyBeobZugeordnetKoordToTpop/index.js'
import { createNewPopFromBeob } from '../../../../modules/createNewPopFromBeob/index.js'
import { StyledLoadingButton, StyledButton } from '../TpopRouter/Menu.jsx'

export const Menu = memo(
  observer(() => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, beobId, tpopId } = useParams()
    const store = useContext(StoreContext)

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
        client,
        enqueNotification: store.enqueNotification,
      })
      setCopyingBeobZugeordnetKoordToTpop(false)
    }, [beobId, client, store])

    const onClickShowCoordOfBeobOnMapGeoAdminCh = useCallback(() => {
      showCoordOfBeobOnMapGeoAdminCh({
        id: beobId,
        client,
        enqueNotification: store.enqueNotification,
      })
    }, [beobId, client, store])

    const onClickShowCoordOfBeobOnMapsZhCh = useCallback(() => {
      showCoordOfBeobOnMapsZhCh({
        id: beobId,
        client,
        enqueNotification: store.enqueNotification,
      })
    }, [beobId, client, store])

    const [creatingNewPopFromBeob, setCreatingNewPopFromBeob] = useState(false)
    const onClickCreateNewPopFromBeob = useCallback(async () => {
      setCreatingNewPopFromBeob(true)
      await createNewPopFromBeob({
        id: beobId,
        apId,
        projId,
        client,
        store,
        search,
        tanstackQueryClient,
      })
      setTimeout(() => {
        setCreatingNewPopFromBeob(false)
      }, 500)
    }, [beobId, apId, projId, client, store, search])

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

    // ISSUE: refs are sometimes not set on first render
    // SOLUTION: rerender in effect after 500ms if ref is not set
    const coordCopyRef = useRef(null)
    const coordCopyRefWidth = coordCopyRef?.current?.offsetWidth ?? 185
    const zuordnen1Ref = useRef(null)
    const zuordnen1RefWidth = zuordnen1Ref?.current?.offsetWidth ?? 230
    const zuordnen2Ref = useRef(null)
    const zuordnen2RefWidth = zuordnen2Ref?.current?.offsetWidth ?? 242
    const showOnMapsZhChRef = useRef(null)
    const showOnMapsZhChRefWidth = showOnMapsZhChRef?.current?.offsetWidth ?? 98
    const showOnMapGeoAdminChRef = useRef(null)
    const showOnMapGeoAdminChRefWidth =
      showOnMapGeoAdminChRef?.current?.offsetWidth ?? 141

    const [rerenderer, setRerenderer] = useState(0)
    useEffect(() => {
      if (!showOnMapsZhChRef.current) {
        setTimeout(() => setRerenderer((prev) => prev + 1), 500)
      }
    }, [])

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${copyingBeobZugeordnetKoordToTpop}/${isBeobZugeordnet}/${isBeobNichtBeurteilt}/${creatingNewPopFromBeob}`}
        >
          <StyledLoadingButton
            ref={coordCopyRef}
            variant="outlined"
            onClick={onClickCopyingBeobZugeordnetKoordToTpop}
            loading={copyingBeobZugeordnetKoordToTpop}
            width={coordCopyRefWidth}
            hide={(!isBeobZugeordnet).toString()}
          >
            Koordinaten auf die
            <br />
            Teilpopulation übertragen
          </StyledLoadingButton>
          <StyledLoadingButton
            ref={zuordnen1Ref}
            variant="outlined"
            onClick={onClickCreateNewPopFromBeob}
            loading={creatingNewPopFromBeob}
            width={zuordnen1RefWidth}
            hide={(!isBeobNichtBeurteilt).toString()}
          >
            {'Pop. und TPop. gründen >'}
            <br />
            {'Beobachtung der TPop. zuordnen'}
          </StyledLoadingButton>
          <StyledButton
            ref={zuordnen2Ref}
            variant="outlined"
            onClick={onClickNewTpopFromBeob}
            width={zuordnen2RefWidth}
            hide={(!isBeobNichtBeurteilt).toString()}
          >
            {'TPop. in bestehender Pop. gründen'}
            <br />
            {'> Beobachtung der TPop. zuordnen'}
          </StyledButton>
          <StyledButton
            ref={showOnMapsZhChRef}
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapsZhCh}
            width={showOnMapsZhChRefWidth}
            hide={'false'}
          >
            zeige auf
            <br />
            maps.zh.ch
          </StyledButton>
          <StyledButton
            ref={showOnMapGeoAdminChRef}
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapGeoAdminCh}
            width={showOnMapGeoAdminChRefWidth}
            hide={'false'}
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
