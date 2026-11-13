import { SplitPane, Pane } from 'react-split-pane'
import { useAtomValue } from 'jotai'

import { isPrintAtom } from '../../store/index.ts'
import { tree2PathAtom } from '../../store/tree2.ts'
import { ProjektContainer } from './ProjektContainer.tsx'
import { Tree2 } from './Tree2/index.tsx'
import { useProjekteTabs } from '../../modules/useProjekteTabs.ts'

import styles from './index.module.css'

const tree2TabValues = ['tree2', 'daten2', 'filter2', 'karte2']

export const Component = () => {
  const isPrint = useAtomValue(isPrintAtom)
  const tree2Path = useAtomValue(tree2PathAtom)

  const [projekteTabs] = useProjekteTabs()
  const tree2Tabs = [
    ...new Set(tree2TabValues).intersection(new Set(projekteTabs)),
  ]

  return (
    <div className={styles.container}>
      {tree2Tabs.length === 0 || isPrint ?
        <ProjektContainer />
      : <SplitPane direction="horizontal">
          <Pane defaultSize="50%">
            <ProjektContainer />
          </Pane>
          <Pane>
            {/* the second tree is the same workspace against its own store
                and MemoryRouter — no iframe, no app reload when pane 1
                navigates (issues/tree2-second-pane.md) */}
            <Tree2 path={tree2Path} />
          </Pane>
        </SplitPane>
      }
    </div>
  )
}
