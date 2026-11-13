import { describe, it, expect, beforeEach } from 'vitest'

import { store as rootStore, setTreeLastTouchedNodeAtom } from './index.ts'
import {
  tree2Store,
  tree2PathAtom,
  tree2OpenAtom,
  buildTree2Path,
  setTree2PathByActiveNodeArrayAtom,
} from './tree2.ts'
import { navigateObjectAtom, unsetNavigateObjectAtom } from './notifications.ts'
import { treeActiveNodeArrayAtom } from './tree.ts'

// the explicit tree2 openers (QK messages, Karte popups) pass the node to
// open on; the app-bar button passes nothing and the pane derives from
// pane 1. These tests pin the open action's three situations:
// closed pane, closed pane with a STALE navigate (left over from an
// earlier open/close cycle — regression: explicit opens used to land on
// pane 1's node instead), and a live open pane.
const resetPaneState = () => {
  rootStore.set(tree2PathAtom, '')
  rootStore.set(tree2OpenAtom, false)
  tree2Store.set(unsetNavigateObjectAtom)
  tree2Store.set(treeActiveNodeArrayAtom, [])
  rootStore.set(setTreeLastTouchedNodeAtom, [])
}

const openExplicitly = ({
  activeNodeArray,
  search = '?projekteTabs=tree&projekteTabs=daten',
  onlyShowActivePath,
}: {
  activeNodeArray: (string | number)[]
  search?: string
  onlyShowActivePath?: boolean
}) =>
  rootStore.set(setTree2PathByActiveNodeArrayAtom, {
    activeNodeArray,
    search,
    onlyShowActivePath,
  })

beforeEach(resetPaneState)

describe('buildTree2Path', () => {
  it('reduces projekteTabs to the de-2ed tree2 tabs and keeps other params', () => {
    // only the tabs that are active WITH a 2 carry over (the former
    // iframe-src rule): tree2 is active, daten2 is not
    expect(
      buildTree2Path(
        '/Daten/Projekte/abc/Arten/def',
        '?projekteTabs=tree&projekteTabs=daten&projekteTabs=tree2&foo=bar',
      ),
    ).toBe('/Daten/Projekte/abc/Arten/def?foo=bar&projekteTabs=tree')
  })

  it('defaults to tree+daten when no tree2 tabs are active', () => {
    expect(buildTree2Path('/Daten/Projekte', '?projekteTabs=tree')).toBe(
      '/Daten/Projekte?projekteTabs=tree&projekteTabs=daten',
    )
  })

  it('passes onlyShowActivePath through', () => {
    expect(
      buildTree2Path('/Daten/Projekte/abc', '?projekteTabs=tree2', true),
    ).toBe('/Daten/Projekte/abc?projekteTabs=tree&onlyShowActivePath=true')
  })
})

describe('setTree2PathByActiveNodeArrayAtom', () => {
  it('sets the pane start path and node when the pane is closed', () => {
    openExplicitly({
      activeNodeArray: [
        'Projekte',
        'p1',
        'Arten',
        'a1',
        'Populationen',
        'pop1',
      ],
      search: '?projekteTabs=tree&projekteTabs=tree2',
    })

    expect(rootStore.get(tree2PathAtom)).toBe(
      '/Daten/Projekte/p1/Arten/a1/Populationen/pop1?projekteTabs=tree',
    )
    expect(tree2Store.get(treeActiveNodeArrayAtom)).toEqual([
      'Projekte',
      'p1',
      'Arten',
      'a1',
      'Populationen',
      'pop1',
    ])
  })

  it('ignores a stale navigate left over from an earlier open/close cycle', () => {
    // regression: the pane's navigate outlives the pane (module-level
    // store); an explicit open after a close used to navigate the dead
    // memory router and never set the start path, so the pane fell back
    // to pane 1's location
    let called = false
    tree2Store.set(navigateObjectAtom, () => {
      called = true
    })

    openExplicitly({ activeNodeArray: ['Projekte', 'p1', 'Arten', 'a1'] })

    expect(called).toBe(false)
    expect(rootStore.get(tree2PathAtom)).toContain(
      '/Daten/Projekte/p1/Arten/a1',
    )
  })

  it('navigates the open pane in place instead of resetting the start path', () => {
    rootStore.set(tree2OpenAtom, true)
    const navigatedTo: string[] = []
    tree2Store.set(navigateObjectAtom, (path: string) => {
      navigatedTo.push(path)
    })
    rootStore.set(tree2PathAtom, '/Daten/Projekte?projekteTabs=tree')

    openExplicitly({
      activeNodeArray: ['Projekte', 'p1', 'Arten', 'a1'],
      search: '?projekteTabs=tree2&projekteTabs=daten2',
      onlyShowActivePath: true,
    })

    expect(navigatedTo).toEqual([
      '/Daten/Projekte/p1/Arten/a1?projekteTabs=tree&projekteTabs=daten&onlyShowActivePath=true',
    ])
    // start path untouched: the pane does not remount
    expect(rootStore.get(tree2PathAtom)).toBe(
      '/Daten/Projekte?projekteTabs=tree',
    )
  })
})
