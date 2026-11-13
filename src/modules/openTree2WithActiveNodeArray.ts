import { store, setTree2PathByActiveNodeArrayAtom } from '../store/index.ts'

export const openTree2WithActiveNodeArray = ({
  activeNodeArray,
  search,
  projekteTabs,
  setProjekteTabs,
  onlyShowActivePath,
}: {
  activeNodeArray: (string | number)[]
  search: string
  projekteTabs: string[]
  setProjekteTabs: (tabs: string[]) => void
  onlyShowActivePath?: boolean | undefined
}) => {
  store.set(setTree2PathByActiveNodeArrayAtom, {
    activeNodeArray,
    search,
    onlyShowActivePath,
  })
  setProjekteTabs([...projekteTabs, 'tree2', 'daten2'])
}
