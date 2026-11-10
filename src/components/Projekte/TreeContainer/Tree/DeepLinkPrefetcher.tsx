import { useAtomValue } from 'jotai'

import { treeActiveNodeArrayAtom } from '../../../../store/index.ts'
import { ChildLoader } from './ChildLoader.tsx'
import { treeChildrenMenusAtom } from './virtualTreeAtoms.ts'
import type { TreeMenu } from './types.ts'

interface FolderDef {
  /** registers the folder's children, i.e. useApsNavData for 'Arten' */
  listFetcher: string
  /** registers the id node's children, i.e. useApNavData for an Art row */
  nodeFetcher: string
  /** param name the folder's id nodes are passed under */
  idParam: string
  /**
   * folder below the id node with alwaysOpen (the 'Zaehlungen' folders
   * below the Kontrolle nodes): also load it when the url ends at the
   * node - its rows are part of what a deep link is expected to show
   */
  alwaysOpenChild?: { segment: string; fetcher: string }
}

// url segments of the hierarchy folders, spelled like the treeUrl arrays
// the use*NavData modules build. Folders without an entry (i.e.
// 'AP-Berichte', 'Beobachtungen nicht beurteilt') are not prefetched:
// the sequential FocusPathLoader cascade loads them as before.
const folderDefs: Record<string, FolderDef> = {
  Arten: {
    listFetcher: 'useApsNavData',
    nodeFetcher: 'useApNavData',
    idParam: 'apId',
  },
  Populationen: {
    listFetcher: 'usePopsNavData',
    nodeFetcher: 'usePopNavData',
    idParam: 'popId',
  },
  'Teil-Populationen': {
    listFetcher: 'useTpopsNavData',
    nodeFetcher: 'useTpopNavData',
    idParam: 'tpopId',
  },
  'Freiwilligen-Kontrollen': {
    listFetcher: 'useTpopfreiwkontrsNavData',
    nodeFetcher: 'useTpopfreiwkontrNavData',
    idParam: 'tpopkontrId',
    alwaysOpenChild: {
      segment: 'Zaehlungen',
      fetcher: 'useTpopfreiwkontrzaehlsNavData',
    },
  },
  'Feld-Kontrollen': {
    listFetcher: 'useTpopfeldkontrsNavData',
    nodeFetcher: 'useTpopfeldkontrNavData',
    idParam: 'tpopkontrId',
    alwaysOpenChild: {
      segment: 'Zaehlungen',
      fetcher: 'useTpopfeldkontrzaehlsNavData',
    },
  },
  Massnahmen: {
    listFetcher: 'useTpopmassnsNavData',
    nodeFetcher: 'useTpopmassnNavData',
    idParam: 'tpopmassnId',
  },
}

interface Level {
  // same key the registering ChildLoader builds: JSON.stringify(treeUrl)
  key: string
  menu: TreeMenu
}

/**
 * Levels to load for a path, in path order. The url contains every id of
 * the hierarchy, so every level's fetcher can run without waiting for its
 * parent - unlike the cascade, which only learns a node's fetcher from
 * the parent's registered menus.
 */
const levelsForPath = (path: (string | number)[]): Level[] => {
  if (path[0] !== 'Projekte' || path[1] === undefined) return []
  const levels: Level[] = []
  const params: Record<string, unknown> = { projId: path[1] }
  const push = (
    treeUrl: (string | number)[],
    fetcherName: string,
    fetcherParams: Record<string, unknown>,
  ) =>
    levels.push({
      key: JSON.stringify(treeUrl),
      menu: { treeUrl, fetcherName, fetcherParams },
    })

  push(['Projekte', path[1]], 'useProjektNavData', { ...params })

  let prevDef: FolderDef | undefined
  for (let i = 2; i < path.length; i += 2) {
    const folder = String(path[i])
    const id = path[i + 1]
    if (folder === prevDef?.alwaysOpenChild?.segment) {
      // 'Zaehlungen' below a Kontrolle: the fetcher depends on the
      // kontrolle type, and the zaehl rows are leaves
      push(path.slice(0, i + 1), prevDef.alwaysOpenChild.fetcher, {
        ...params,
      })
      return levels
    }
    const def = folderDefs[folder]
    if (!def) return levels
    push(path.slice(0, i + 1), def.listFetcher, { ...params })
    if (id === undefined) return levels
    params[def.idParam] = id
    push(path.slice(0, i + 2), def.nodeFetcher, { ...params })
    if (path[i + 2] === undefined && def.alwaysOpenChild) {
      push(
        [...path.slice(0, i + 2), def.alwaysOpenChild.segment],
        def.alwaysOpenChild.fetcher,
        { ...params },
      )
      return levels
    }
    prevDef = def
  }
  return levels
}

/**
 * Loads all levels of the active node's path in parallel.
 *
 * The lazy tree loads children level by level: a folder's ChildLoader only
 * mounts once its row exists, so a deep link walks the whole hierarchy
 * sequentially (FocusPathLoader advances the frontier one level per
 * registration - ~10 sequential rounds for a Kontrolle url). On a deep
 * link every id is already known from the url, so all levels' fetchers can
 * run at once and the path completes after the slowest single level
 * instead of the sum of all.
 *
 * Registrations are idempotent: the atom write skips equal menus, and the
 * row ChildLoaders (and FocusPathLoader for folders not in folderDefs)
 * re-register the same children without extra fetches - React Query
 * dedupes by queryKey.
 */
export const DeepLinkPrefetcher = () => {
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const childrenMenus = useAtomValue(treeChildrenMenusAtom)

  const levels = levelsForPath(activeNodeArray).filter(
    (level) => !childrenMenus.has(level.key),
  )

  if (!levels.length) return null

  return (
    <>
      {levels.map((level) => (
        <ChildLoader
          key={level.key}
          menu={level.menu}
        />
      ))}
    </>
  )
}
