import { FilesRouter } from '../../../../shared/Files/index.jsx'
import styles from './Files.module.css'

export const Files = ({ row }) => (
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
