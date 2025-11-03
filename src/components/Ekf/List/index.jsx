import { uniq } from 'es-toolkit'

import { Item } from './Item.jsx'
import { container } from './index.module.css'

export const EkfList = ({ ekf }) => {
  const projektCount = uniq(ekf.map((e) => e.projekt)).length

  return (
    <div className={container}>
      {ekf.map((ek) => (
        <Item
          key={ek.id}
          projektCount={projektCount}
          row={ek}
        />
      ))}
    </div>
  )
}
