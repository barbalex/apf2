import { useContext, lazy, Suspense, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router'
import { useParams, useLocation } from 'react-router'
import { useAtom } from 'jotai'
import { SplitPane, Pane } from 'react-split-pane'

// DO NOT lazy load Karte! https://github.com/barbalex/apf2/issues/616
import { Karte } from './Karte/index.jsx'
const TreeContainer = lazy(async () => ({
  default: (await import('./TreeContainer/index.jsx')).TreeContainer,
}))
const Exporte = lazy(async () => ({
  default: (await import('./Exporte/index.jsx')).Exporte,
}))
const Filter = lazy(async () => ({
  default: (await import('./Filter/index.jsx')).Filter,
}))
import { MobxContext } from '../../mobxContext.js'
import { Spinner } from '../shared/Spinner.jsx'
import { useProjekteTabs } from '../../modules/useProjekteTabs.js'
import { Bookmarks } from '../Bookmarks/Bookmarks/index.jsx'
import { hideBookmarksAtom } from '../../JotaiStore/index.js'

import {
  outerContainer,
  container,
  innerContainer,
} from './ProjektContainer.module.css'

export const ProjektContainer = observer(() => {
  const { projId, apberuebersichtId, apberId } = useParams()
  const { pathname } = useLocation()

  const store = useContext(MobxContext)
  const { isPrint } = store

  const [hideBookmarks] = useAtom(hideBookmarksAtom)

  const treeTabValues = [
    'tree',
    'daten',
    'filter',
    'karte',
    ...(projId ? ['exporte'] : []),
  ]

  const [projekteTabs] = useProjekteTabs()

  const treeTabs = [
    ...new Set(treeTabValues).intersection(new Set(projekteTabs)),
  ]

  // console.log('ProjektContainer, treeTabs:', treeTabs)

  const showApberForArt = apberId && pathname.endsWith('print')
  const showApberForAll = apberuebersichtId && pathname.endsWith('print')

  // need this to prevent map from greying out on resize
  // https://github.com/PaulLeCam/react-leaflet/issues/1074
  const mapContainerRef = useRef(null)

  const elObj = {
    tree: (
      <div className={innerContainer}>
        <Suspense fallback={<Spinner />}>
          <TreeContainer />
        </Suspense>
      </div>
    ),
    daten: (
      <div className={innerContainer}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </div>
    ),
    filter: (
      <div className={innerContainer}>
        <Suspense fallback={<Spinner />}>
          <Filter />
        </Suspense>
      </div>
    ),
    karte: (
      <div className={innerContainer} ref={mapContainerRef}>
        <Suspense fallback={<Spinner />}>
          <Karte mapContainerRef={mapContainerRef} />
        </Suspense>
      </div>
    ),
    exporte: (
      <div className={innerContainer}>
        <Suspense fallback={<Spinner />}>
          <Exporte />
        </Suspense>
      </div>
    ),
  }

  if (isPrint) return <Outlet />

  const overflowPane1InSplitPane1 =
    treeTabs[0] === 'daten' && (showApberForAll || showApberForArt)
  const overflowPane2InSplitPane1 =
    treeTabs[1] === 'daten' &&
    treeTabs.length === 2 &&
    (showApberForAll || showApberForArt)
  const overflowPane1InSplitPane2 =
    treeTabs[1] === 'daten' &&
    treeTabs.length > 2 &&
    (showApberForAll || showApberForArt)

  console.log('ProjektContainer', { treeTabs, length: treeTabs.length })

  return (
    <div className={outerContainer}>
      {!hideBookmarks && <Bookmarks />}
      <div
        className={container}
        height={hideBookmarks ? '100%' : 'calc(100% - 40.8px)'}
        style={{ height: hideBookmarks ? '100%' : 'calc(100% - 40.8px)' }}
      >
        <SplitPane
          direction="horizontal"
          className={`${overflowPane1InSplitPane1 ? 'Pane1-overflowing' : ''} ${
            overflowPane2InSplitPane1 ? 'Pane2-overflowing' : ''
          }`}
        >
          <Pane
            key={treeTabs.length}
            size={
              treeTabs.length === 1
                ? '100%'
                : treeTabs.length === 2 && treeTabs[0] === 'tree'
                  ? '33%'
                  : `${100 / treeTabs.length}%`
            }
            maxSize={-10}
          >
            {elObj[treeTabs[0]]}
          </Pane>
          {treeTabs.length > 0 && (
            <Pane>{elObj[treeTabs[1]] ?? undefined}</Pane>
          )}
          {!!elObj[treeTabs[2]] && <Pane>{elObj[treeTabs[2]]}</Pane>}
          {!!elObj[treeTabs[3]] && (
            <Pane
              // size={`${100 / (treeTabs.length - 2)}%`}
              maxSize={-10}
            >
              {elObj[treeTabs[3]]}
            </Pane>
          )}
          {!!elObj[treeTabs[4]] && <Pane>{elObj[treeTabs[4]]}</Pane>}
        </SplitPane>
      </div>
    </div>
  )
})
