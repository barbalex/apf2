import { useEffect, useRef } from 'react'
import { useLocation, useNavigation } from 'react-router'
import { SplitPane, Pane } from 'react-split-pane'
import { useAtomValue } from 'jotai'

import { isPrintAtom, store } from '../../store/index.ts'
import { tree2PathAtom, buildTree2Path } from '../../store/tree2.ts'
import { ProjektContainer } from './ProjektContainer.tsx'
import { Tree2 } from './Tree2/index.tsx'
import { useProjekteTabs } from '../../modules/useProjekteTabs.ts'

import styles from './index.module.css'

const tree2TabValues = ['tree2', 'daten2', 'filter2', 'karte2']

export const Component = () => {
  const isPrint = useAtomValue(isPrintAtom)
  const tree2Path = useAtomValue(tree2PathAtom)
  const { pathname, search } = useLocation()
  // pending while a router navigation is in flight — the pane must not
  // open on a location that is about to change
  const navigation = useNavigation()

  const [projekteTabs] = useProjekteTabs()
  const tree2Tabs = [
    ...new Set(tree2TabValues).intersection(new Set(projekteTabs)),
  ]
  // tree2Path is set by the effect below (or an explicit open action)
  // before the pane mounts
  const paneIsOpen = tree2Tabs.length > 0 && !isPrint && !!tree2Path

  // whether the pane was open in the last committed state — the reset
  // below must only react to the pane really closing, never to the
  // tab-less gap between an explicit open's path-set and its tab
  // navigation committing (that gap wiped the explicit path and the pane
  // re-derived pane 1's location instead)
  const paneWasOpenRef = useRef(false)

  useEffect(() => {
    // opening the pane without an explicit target (the app-bar button)
    // starts it at pane 1's current location — the former iframe-src
    // default. Explicit targets (map popups, Qk) set the atom beforehand.
    // Closing resets it so the next open re-derives.
    //
    // Never touch the path while a navigation is pending: an explicit
    // open sets the path and opens the tabs in one go, and during that
    // navigation's loading phase the tabs are not yet committed
    if (navigation.state !== 'idle') return

    const paneIsOpen = tree2Tabs.length > 0 && !isPrint
    if (paneIsOpen) {
      // derive only from a committed location: tree clicks open nodes
      // (and can make new rows visible) before the navigation commits
      if (!tree2Path) {
        store.set(tree2PathAtom, buildTree2Path(pathname, search))
      }
    } else if (paneWasOpenRef.current && tree2Path) {
      store.set(tree2PathAtom, '')
    }
    paneWasOpenRef.current = paneIsOpen
  }, [tree2Tabs.length, isPrint, tree2Path, pathname, search, navigation.state])

  return (
    <div className={styles.container}>
      {/* the SplitPane is always mounted with both panes — pane 1 must
          never change tree position, or its whole workspace (tree + form)
          remounts whenever the pane opens or closes (the QK form lost its
          state and refetched). The closed state is styles-only: pane 1
          forced to full width (the Pane's style prop wins over the
          library's computed width), divider hidden, pane 2 collapsed.
          Uncontrolled sizing keeps drag-resize working; the overrides are
          undefined while open, so a dragged size survives close/reopen */}
      <SplitPane
        direction="horizontal"
        dividerStyle={paneIsOpen ? {} : { display: 'none' }}
      >
        <Pane
          defaultSize="50%"
          style={paneIsOpen ? {} : { width: '100%' }}
        >
          <ProjektContainer />
        </Pane>
        <Pane
          style={
            paneIsOpen ? {} : { width: 0, minWidth: 0, overflow: 'hidden' }
          }
        >
          {/* the second tree is the same workspace against its own store
              and memory router — no iframe, no app reload when pane 1
              navigates (issues/tree2-second-pane.md) */}
          {paneIsOpen && <Tree2 path={tree2Path} />}
        </Pane>
      </SplitPane>
    </div>
  )
}
