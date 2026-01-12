import { Root } from './Root.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'
import { Menu } from './Menu.jsx'

import styles from './index.module.css'

export const TreeComponent = () => (
  <div className={styles.container}>
    <Root />
    <IntoViewScroller />
    <Menu />
  </div>
)
