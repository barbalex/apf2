import { lazy, Suspense, useRef } from 'react'
import { Outlet } from 'react-router'
import { useParams, useLocation } from 'react-router'
import { useAtomValue } from 'jotai'
import { SplitPane, Pane } from 'react-split-pane'

// DO NOT lazy load Karte! https://github.com/barbalex/apf2/issues/616
import { Karte } from './Karte/index.tsx'
const TreeContainer = lazy(async () => ({
  default: (await import('./TreeContainer/index.tsx')).TreeContainer,
}))
const Exporte = lazy(async () => ({
  default: (await import('./Exporte/index.tsx')).Exporte,
}))
const Filter = lazy(async () => ({
  default: (await import('./Filter/index.tsx')).Filter,
}))
import { Spinner } from '../shared/Spinner.tsx'
import { useProjekteTabs } from '../../modules/useProjekteTabs.ts'
import { Bookmarks } from '../Bookmarks/Bookmarks/index.tsx'
import { hideBookmarksAtom, isPrintAtom } from '../../JotaiStore/index.ts'

import styles from './ProjektContainer.module.css'
import { fi } from 'date-fns/locale'
import { first } from 'rxjs'

export const ProjektContainer = () => {
  const { projId, apberuebersichtId, apberId } = useParams()
  const { pathname } = useLocation()

  const isPrint = useAtomValue(isPrintAtom)

  const hideBookmarks = useAtomValue(hideBookmarksAtom)

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

  const showApberForArt = apberId && pathname.endsWith('print')
  const showApberForAll = apberuebersichtId && pathname.endsWith('print')

  // need this to prevent map from greying out on resize
  // https://github.com/PaulLeCam/react-leaflet/issues/1074
  const mapContainerRef = useRef(null)

  const elObj = {
    tree: (
      <div className={styles.innerContainer}>
        <Suspense fallback={<Spinner />}>
          <TreeContainer />
        </Suspense>
      </div>
    ),
    daten: (
      <div className={styles.innerContainer}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </div>
    ),
    filter: (
      <div className={styles.innerContainer}>
        <Suspense fallback={<Spinner />}>
          <Filter />
        </Suspense>
      </div>
    ),
    karte: (
      <div
        className={styles.innerContainer}
        ref={mapContainerRef}
      >
        <Suspense fallback={<Spinner />}>
          <Karte mapContainerRef={mapContainerRef} />
        </Suspense>
      </div>
    ),
    exporte: (
      <div className={styles.innerContainer}>
        <Suspense fallback={<Spinner />}>
          <Exporte />
        </Suspense>
      </div>
    ),
  }

  if (isPrint) return <Outlet />

  // TODO: why were these needed?
  // const overflowPane1 =
  //   treeTabs[0] === 'daten' && (showApberForAll || showApberForArt)
  // const overflowPane2 =
  //   treeTabs[1] === 'daten' && (showApberForAll || showApberForArt)

  const firstOfTwoIsTree = treeTabs[0] === 'tree' && treeTabs.length === 2
  const singlePane = treeTabs.length === 1
  const firstPaneSize =
    singlePane ? '100%'
    : firstOfTwoIsTree ? '33%'
    : undefined
  const firstPaneMaxSize = singlePane ? null : '95%'

  // issue with extra panes only appearing with help of keys
  // issue with max 4 panes shown dynamically (5 show on reload only). Solution: size null, not undefined!!!
  return (
    <div className={styles.outerContainer}>
      {!hideBookmarks && <Bookmarks />}
      <div
        className={styles.container}
        style={{ height: hideBookmarks ? '100%' : 'calc(100% - 40.8px)' }}
      >
        <SplitPane direction="horizontal">
          <Pane
            size={firstPaneSize}
            maxSize={firstPaneMaxSize}
            className={styles.overflowingPane}
          >
            {elObj[treeTabs[0]]}
          </Pane>
          <Pane
            key={treeTabs.length > 1 ? treeTabs[1] : 'emptyPane2'}
            maxSize="95%"
            className={styles.overflowingPane}
            size={treeTabs.length > 1 ? null : 0}
          >
            {treeTabs[1] ? elObj[treeTabs[1]] : null}
          </Pane>
          <Pane
            key={treeTabs.length > 2 ? treeTabs[2] : 'emptyPane3'}
            maxSize="95%"
            size={treeTabs.length > 2 ? null : 0}
          >
            {treeTabs[2] ? elObj[treeTabs[2]] : null}
          </Pane>
          <Pane
            key={treeTabs.length > 3 ? treeTabs[3] : 'emptyPane4'}
            maxSize="95%"
            size={treeTabs.length > 3 ? null : 0}
          >
            {treeTabs[3] ? elObj[treeTabs[3]] : null}
          </Pane>
          <Pane
            key={treeTabs.length > 4 ? treeTabs[4] : 'emptyPane5'}
            maxSize="95%"
            size={treeTabs.length > 4 ? null : 0}
          >
            {treeTabs[4] ? elObj[treeTabs[4]] : null}
          </Pane>
        </SplitPane>
      </div>
    </div>
  )
}
