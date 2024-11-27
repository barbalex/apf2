import { memo, useContext, useMemo, lazy, Suspense, useRef } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import intersection from 'lodash/intersection'
import { Outlet } from 'react-router'
import { useParams, useLocation } from 'react-router'
import { useAtom } from 'jotai'

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
import { StoreContext } from '../../storeContext.js'
import { StyledSplitPane } from '../shared/StyledSplitPane.jsx'
import { Spinner } from '../shared/Spinner.jsx'
import { useProjekteTabs } from '../../modules/useProjekteTabs.js'
import { Bookmarks } from '../Bookmarks/index.jsx'
import { constants } from '../../modules/constants.js'
import { alwaysShowBookmarksAtom } from '../../JotaiStore/index.js'

const isMobileView = window.innerWidth <= constants.mobileViewMaxWidth

const OuterContainer = styled.div`
  display: block;
  height: 100%;
  overflow: hidden;
`
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

export const ProjektContainer = memo(
  observer(() => {
    const { projId, apberUebersichtId, apberId } = useParams()
    const { pathname } = useLocation()

    const store = useContext(StoreContext)
    const { isPrint } = store
    const [alwaysShowBookmarks] = useAtom(alwaysShowBookmarksAtom)

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

    const [projekteTabs] = useProjekteTabs()

    const treeTabs = useMemo(
      () => intersection(treeTabValues, projekteTabs),
      [projekteTabs, treeTabValues],
    )

    // console.log('ProjektContainer, treeTabs:', treeTabs)

    const showApberForArt = apberId && pathname.endsWith('print')
    const showApberForAll = apberUebersichtId && pathname.endsWith('print')

    // need this to prevent map from greying out on resize
    // https://github.com/PaulLeCam/react-leaflet/issues/1074
    const mapContainerRef = useRef(null)

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
        <InnerContainer ref={mapContainerRef}>
          <Suspense fallback={<Spinner />}>
            <Karte mapContainerRef={mapContainerRef} />
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

    const showBookmarks = isMobileView || alwaysShowBookmarks

    if (isPrint) {
      return <Outlet />
    }

    return (
      <OuterContainer>
        {showBookmarks && <Bookmarks />}
        <Container>
          <StyledSplitPane
            split="vertical"
            size={
              treeTabs.length === 2 && treeTabs[0] === 'tree' ?
                '33%'
              : `${100 / treeTabs.length}%`
            }
            maxSize={-10}
            overflowPane1={
              treeTabs[0] === 'daten' && (showApberForAll || showApberForArt) ?
                'auto'
              : 'hidden'
            }
            overflowPane2={
              (
                treeTabs[1] === 'daten' &&
                treeTabs.length === 2 &&
                (showApberForAll || showApberForArt)
              ) ?
                'auto'
              : 'hidden'
            }
          >
            {elObj[treeTabs[0]]}
            {treeTabs.length === 1 && <></>}
            {treeTabs.length === 2 && <>{elObj[treeTabs[1]]}</>}
            {treeTabs.length > 2 && (
              <StyledSplitPane
                split="vertical"
                size={`${100 / (treeTabs.length - 1)}%`}
                maxSize={-10}
                overflowPane1={
                  (
                    treeTabs[1] === 'daten' &&
                    treeTabs.length > 2 &&
                    (showApberForAll || showApberForArt)
                  ) ?
                    'auto'
                  : 'hidden'
                }
              >
                {elObj[treeTabs[1]]}
                {treeTabs.length === 3 && elObj[treeTabs[2]]}
                {treeTabs.length > 3 && (
                  <StyledSplitPane
                    split="vertical"
                    size={`${100 / (treeTabs.length - 2)}%`}
                    maxSize={-10}
                  >
                    {elObj[treeTabs[2]]}
                    {treeTabs.length === 4 && elObj[treeTabs[3]]}
                    {treeTabs.length === 5 && (
                      <StyledSplitPane
                        split="vertical"
                        size="50%"
                        maxSize={-10}
                      >
                        {elObj[treeTabs[3]]}
                        {elObj[treeTabs[4]]}
                      </StyledSplitPane>
                    )}
                  </StyledSplitPane>
                )}
              </StyledSplitPane>
            )}
          </StyledSplitPane>
        </Container>
      </OuterContainer>
    )
  }),
)
