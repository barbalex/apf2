import { useContext, useMemo, lazy, Suspense } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import intersection from 'lodash/intersection'
import { Outlet } from 'react-router-dom'
import { useParams, useLocation } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

// DO NOT lazy load Karte! https://github.com/barbalex/apf2/issues/616
import Karte from './Karte'
const TreeContainer = lazy(() => import('./TreeContainer'))
const Exporte = lazy(() => import('./Exporte'))
const Filter = lazy(() => import('./Filter'))
import storeContext from '../../storeContext'
import { Allotment } from 'allotment'
import useSearchParamsState from '../../modules/useSearchParamsState'
import isMobilePhone from '../../modules/isMobilePhone'
import Spinner from '../shared/Spinner'

const Container = styled.div`
  height: 100%;
  position: relative;

  @media print {
    display: block;
    height: auto !important;
  }
`
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ProjektContainer = () => {
  const { projId, apberUebersichtId, apberId } = useParams()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const { isPrint, bounds } = store
  // react hooks 'exhaustive-deps' rule wants to move treeTabValues into own useMemo
  // to prevent it from causing unnessecary renders
  // BUT: this prevents necessary renders: clicking tabs does not cause re-render!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const treeTabValues = [
    'tree',
    'daten',
    'filter',
    'karte',
    ...(projId ? ['exporte'] : []),
  ]

  const [projekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )

  const treeTabs = useMemo(
    () => intersection(treeTabValues, projekteTabs),
    [projekteTabs, treeTabValues],
  )

  // console.log('ProjektContainer, treeTabs:', treeTabs)

  const showApberForArt = apberId && pathname.endsWith('print')
  const showApberForAll = apberUebersichtId && pathname.endsWith('print')

  const elObj = {
    tree: (
      <InnerContainer>
        <Suspense fallback={<Spinner />}>
          <TreeContainer />
        </Suspense>
      </InnerContainer>
    ),
    daten: (
      <InnerContainer>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </InnerContainer>
    ),
    filter: (
      <InnerContainer>
        <Suspense fallback={<Spinner />}>
          <Filter />
        </Suspense>
      </InnerContainer>
    ),
    karte: (
      <InnerContainer>
        <Suspense fallback={<Spinner />}>
          <Karte />
        </Suspense>
      </InnerContainer>
    ),
    exporte: (
      <InnerContainer>
        <Suspense fallback={<Spinner />}>
          <Exporte />
        </Suspense>
      </InnerContainer>
    ),
  }

  if (isPrint) {
    return <Outlet />
  }

  console.log('ProjektContainer, treeTabs:', treeTabs)

  return (
    <Container>
      <Allotment
        key={JSON.stringify(treeTabs)}
        onChange={() => {
          let activeZoom
          let activeCenter
          try {
            activeZoom = store.map?.map?.getZoom?.()
            activeCenter = store.map?.map?.getCenter?.()
          } catch (error) {
            console.log('ProjektContainer, error getting map zoom:', error)
            return
          }
          const activeCenterConverted = [activeCenter?.lat, activeCenter?.lng]
          console.log('ProjektContainer', {
            activeCenterConverted,
            activeCenter,
            storeCenter: store.center,
            activeZoom,
            storeZoom: store.zoom,
          })
          // store.map?.map?.invalidateSize?.(false)
          // fit bounds if they have changed
          if (
            isEqual(activeCenterConverted, store.center) &&
            activeZoom === store.zoom
          ) {
            return
          }
          try {
            store.map?.map?.setView?.(store.center, store.zoom)
          } catch (error) {
            console.log('ProjektContainer, error fitting map bounds:', error)
            // do nothing
          }
        }}
      >
        <Allotment.Pane
          preferredSize={
            treeTabs.length === 2 && treeTabs[0] === 'tree'
              ? '33%'
              : `${100 / treeTabs.length}%`
          }
          // overflowPane1={
          //   treeTabs[0] === 'daten' && (showApberForAll || showApberForArt)
          //     ? 'auto'
          //     : 'hidden'
          // }
          // overflowPane2={
          //   treeTabs[1] === 'daten' &&
          //   treeTabs.length === 2 &&
          //   (showApberForAll || showApberForArt)
          //     ? 'auto'
          //     : 'hidden'
          // }
        >
          {elObj[treeTabs[0]]}
        </Allotment.Pane>
        {treeTabs.length === 1 && (
          <Allotment.Pane visible={false}></Allotment.Pane>
        )}
        {treeTabs.length === 2 && (
          <Allotment.Pane>{elObj[treeTabs[1]]}</Allotment.Pane>
        )}
        {treeTabs.length > 2 && (
          <Allotment.Pane
            preferredSize={`${100 / treeTabs.length}%`}
            // overflowPane1={
            //   treeTabs[1] === 'daten' &&
            //   treeTabs.length > 2 &&
            //   (showApberForAll || showApberForArt)
            //     ? 'auto'
            //     : 'hidden'
            // }
          >
            {elObj[treeTabs[1]]}
          </Allotment.Pane>
        )}
        {treeTabs.length === 3 && (
          <Allotment.Pane>{elObj[treeTabs[2]]}</Allotment.Pane>
        )}
        {treeTabs.length > 3 && (
          <Allotment.Pane preferredSize={`${100 / treeTabs.length}%`}>
            {elObj[treeTabs[2]]}
          </Allotment.Pane>
        )}
        {treeTabs.length === 4 && (
          <Allotment.Pane preferredSize={`${100 / treeTabs.length}%`}>
            {elObj[treeTabs[3]]}
          </Allotment.Pane>
        )}
        {treeTabs.length === 5 && (
          <Allotment.Pane preferredSize={`${100 / treeTabs.length}%`}>
            {elObj[treeTabs[3]]}
          </Allotment.Pane>
        )}
        {treeTabs.length === 5 && (
          <Allotment.Pane preferredSize={`${100 / treeTabs.length}%`}>
            {elObj[treeTabs[4]]}
          </Allotment.Pane>
        )}
      </Allotment>
    </Container>
  )
}

export default observer(ProjektContainer)
