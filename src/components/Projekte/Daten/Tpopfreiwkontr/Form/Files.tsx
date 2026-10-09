import { FilesRouter } from '../../../../shared/Files/index.tsx'
import type { TpopkontrId } from '../../../../../models/apflora/Tpopkontr.ts'
import styles from './Files.module.css'

interface FilesProps {
  row: {
    id: TpopkontrId
  }
}

export const Files = ({ row }: FilesProps) => (
  <div className={styles.container}>
    <div className={styles.label}>Dateien</div>
    <div className={styles.val}>
      <FilesRouter
        parentId={row.id}
        parent="tpopkontr"
      />
    </div>
  </div>
)
