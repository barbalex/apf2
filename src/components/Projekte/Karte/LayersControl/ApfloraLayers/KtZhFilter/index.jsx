import { useContext } from 'react'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../../../mobxContext.js'
import styles from './index.module.css'

export const KtZhFilter = observer(() => {
  const store = useContext(MobxContext)
  const { setMapFilter, incrementMapFilterResetter } = store.tree

  const onClickFilterZh = () =>
    import('./ktZh.json').then((module) => {
      const ktZh = module.default
      incrementMapFilterResetter()
      setMapFilter(ktZh)
    })

  return (
    <div className={styles.layer}>
      <Button
        title="Kt. ZH filtern"
        onClick={onClickFilterZh}
        color="inherit"
        className={styles.button}
      >
        Kanton Zürich filtern
      </Button>
    </div>
  )
})
