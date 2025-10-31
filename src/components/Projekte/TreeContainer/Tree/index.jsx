import { Root } from './Root.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'
import { Menu } from './Menu.jsx'

import { container } from './index.module.css'

export const TreeComponent = () => (
  <div className={container}>
    <Root />
    <IntoViewScroller />
    <Menu />
  </div>
)
