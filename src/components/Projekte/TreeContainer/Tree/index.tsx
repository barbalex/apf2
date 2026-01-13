import { Root } from './Root.tsx'
import { IntoViewScroller } from './IntoViewScroller.tsx'
import { Menu } from './Menu.tsx'

import styles from './index.module.css'

export const TreeComponent = () => (
  <div className={styles.container}>
    <Root />
    <IntoViewScroller />
    <Menu />
  </div>
)
