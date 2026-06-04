import {
  store,
  setTree2SrcByActiveNodeArrayAtom,
} from '../store/index.ts'

export const openTree2WithActiveNodeArray = ({
  activeNodeArray,
  search,
  projekteTabs,
  setProjekteTabs,
  onlyShowActivePath,
}) => {
  store.set(setTree2SrcByActiveNodeArrayAtom, {
    activeNodeArray,
    search,
    onlyShowActivePath,
  })
  setProjekteTabs([...projekteTabs, 'tree2', 'daten2'])
}
