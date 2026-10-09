import Button from '@mui/material/Button'
import { useSetAtom } from 'jotai'

import {
  treeMapFilterAtom,
  treeIncrementMapFilterResetterAtom,
} from '../../../../../../store/index.ts'
import styles from './index.module.css'

export const KtZhFilter = () => {
  const incrementMapFilterResetter = useSetAtom(
    treeIncrementMapFilterResetterAtom,
  )
  // the store atom is typed as undefined
  // but geojson filters are passed into it
  const setMapFilter = useSetAtom(treeMapFilterAtom) as (
    value:
      | { type: string; coordinates: number[][][] }
      | Record<string, unknown>
      | undefined
  ) => void

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
        onClick={() => void onClickFilterZh()}
        color="inherit"
        className={styles.button}
      >
        Kanton Zürich filtern
      </Button>
    </div>
  )
}
