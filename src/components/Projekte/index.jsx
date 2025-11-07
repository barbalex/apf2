import { useContext, lazy, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { useLocation } from 'react-router'
import queryString from 'query-string'
import SplitPane from 'react-split-pane'

// when Karte was loaded async, it did not load,
// but only in production!
import { ProjektContainer } from './ProjektContainer.jsx'
import { MobxContext } from '../../mobxContext.js'
// import AppRenderer from '../../AppRenderer'
import { appBaseUrl } from '../../modules/appBaseUrl.js'
import { inIframe } from '../../modules/inIframe.js'
import { useProjekteTabs } from '../../modules/useProjekteTabs.js'

const ApFilterController = lazy(async () => ({
  default: (await import('./ApFilterController.jsx')).ApFilterController,
}))

import { container, iframe } from './index.module.css'

const isInIframe = inIframe()

const tree2TabValues = ['tree2', 'daten2', 'filter2', 'karte2']

export const Component = observer(() => {
  const { pathname, search } = useLocation()
  const store = useContext(MobxContext)
  const { isPrint } = store
  const { tree2Src } = store.tree

  const [projekteTabs] = useProjekteTabs()
  const tree2Tabs = [
    ...new Set(tree2TabValues).intersection(new Set(projekteTabs)),
  ]

  let iFrameSrc = tree2Src
  if (!tree2Src) {
    // build search string for iframe
    const iFrameSearch = queryString.parse(search)
    // need to alter projekteTabs:
    if (Array.isArray(iFrameSearch.projekteTabs)) {
      iFrameSearch.projekteTabs = iFrameSearch.projekteTabs
        // - remove non-tree2 values
        .filter((t) => t.includes('2'))
        // - rewrite tree2 values to tree values
        .map((t) => t.replace('2', ''))
    } else if (iFrameSearch.projekteTabs) {
      iFrameSearch.projekteTabs = [iFrameSearch.projekteTabs]
        // - remove non-tree2 values
        .filter((t) => t.includes('2'))
        // - rewrite tree2 values to tree values
        .map((t) => t.replace('2', ''))
    }
    const newSearch = queryString.stringify(iFrameSearch)
    // pass this via src to iframe
    iFrameSrc = `${appBaseUrl().slice(0, -1)}${pathname}?${newSearch}`
  }

  if (isInIframe) {
    // inside iframe app bar should be hidden
    return (
      <div className={container}>
        {tree2Tabs.length === 0 || isPrint ?
          <ProjektContainer />
        : <SplitPane
            split="vertical"
            defaultSize="50%"
          >
            <ProjektContainer />
            <iframe
              className={iframe}
              src={iFrameSrc}
              title="tree2"
              width="100%"
              height="100%"
            />
          </SplitPane>
        }
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={null}>
        <ApFilterController />
      </Suspense>
      <div className={container}>
        {tree2Tabs.length === 0 || isPrint ?
          <ProjektContainer />
        : <SplitPane
            split="vertical"
            defaultSize="50%"
          >
            <ProjektContainer />
            <iframe
              className={iframe}
              src={iFrameSrc}
              title="tree2"
              width="100%"
              height="100%"
            />
          </SplitPane>
        }
      </div>
    </>
  )
})
