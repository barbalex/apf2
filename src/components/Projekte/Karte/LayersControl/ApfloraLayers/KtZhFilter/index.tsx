import Button from '@mui/material/Button'
import { useSetAtom } from 'jotai'

import {
  treeSetMapFilterAtom,
  treeIncrementMapFilterResetterAtom,
} from '../../../../../../store/index.ts'
import styles from './index.module.css'

export const KtZhFilter = () => {
  const setMapFilter = useSetAtom(treeSetMapFilterAtom)
  const incrementMapFilterResetter = useSetAtom(
    treeIncrementMapFilterResetterAtom,
  )

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
}
