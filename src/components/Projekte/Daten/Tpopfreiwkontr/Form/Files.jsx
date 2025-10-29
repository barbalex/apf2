import { FilesRouter } from '../../../../shared/Files/index.jsx'
import { container, label, val } from './Files.module.css'

export const Files = ({ row }) => (
  <div className={container}>
    <div className={label}>Dateien</div>
    <div className={val}>
      <FilesRouter
        parentId={row.id}
        parent="tpopkontr"
      />
    </div>
  </div>
)
