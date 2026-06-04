import { FaTrash, FaTrashAlt, FaRegTrashAlt } from 'react-icons/fa'
import { MdInfoOutline } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useSetAtom, useAtomValue } from 'jotai'

import {
  treeEmptyNodeLabelFilterAtom,
  treeApFilterAtom,
  treeEmptyMapFilterAtom,
  treeDataFilterAtom,
  treeDataFilterEmptyTableAtom,
  treeDataFilterEmptyTabAtom,
  treeDataFilterEmptyAtom,
} from '../../store/index.ts'
import { exists } from '../../modules/exists.ts'
import { appBaseUrl } from '../../modules/appBaseUrl.ts'
import { tableIsFiltered } from '../../modules/tableIsFiltered.ts'

import styles from './FilterTitle.module.css'

export const FilterTitle = ({
  title,
  table,
  totalNr,
  filteredNr,
  activeTab,
}) => {
  const emptyNodeLabelFilter = useSetAtom(treeEmptyNodeLabelFilterAtom)
  const setApFilter = useSetAtom(treeApFilterAtom)
  const emptyMapFilter = useSetAtom(treeEmptyMapFilterAtom)
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const emptyDataFilterTable = useSetAtom(treeDataFilterEmptyTableAtom)
  const emptyDataFilterTab = useSetAtom(treeDataFilterEmptyTabAtom)
  const emptyDataFilter = useSetAtom(treeDataFilterEmptyAtom)

  const existsTableFilter = tableIsFiltered({ table })
  const tables = Object.keys(dataFilter)
  const existsTreeFilter = tables.some((table) => tableIsFiltered({ table }))

  const onEmptyTab = () => emptyDataFilterTab({ table, activeTab })
  const onEmptyTable = () => emptyDataFilterTable({ table })

  const onEmptyTree = () => {
    emptyNodeLabelFilter()
    emptyDataFilter()
    emptyMapFilter()
    setApFilter(false)
  }

  const onClickInfo = () => {
    const url = `${appBaseUrl()}Dokumentation/filter`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.filterNumbers}>
          {exists(filteredNr) && (
            <>
              <span title="gefilterte Anzahl">
                {filteredNr?.toLocaleString('de-ch')}
              </span>
              /
              <span title="ungefilterte Anzahl">
                {totalNr?.toLocaleString('de-ch')}
              </span>
            </>
          )}
        </div>
        {activeTab !== undefined && (
          <Tooltip title={`Aktuelles Filter-Kriterium entfernen`}>
            <span>
              <IconButton
                aria-label={`Aktuelles Filter-Kriterium entfernen`}
                onClick={onEmptyTab}
                size="small"
                disabled={!existsTableFilter}
              >
                <FaRegTrashAlt className={styles.deleteFilterIcon} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={`${title}-Filter entfernen`}>
          <span>
            <IconButton
              aria-label={`${title}-Filter entfernen`}
              onClick={onEmptyTable}
              size="small"
              disabled={!existsTableFilter}
            >
              <FaTrashAlt className={styles.deleteFilterIcon} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Alle Filter entfernen">
          <span>
            <IconButton
              aria-label="Alle Filter entfernen"
              onClick={onEmptyTree}
              size="small"
              disabled={!existsTreeFilter}
            >
              <FaTrash className={styles.deleteFilterIcon} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Filter-Dokumentation">
          <IconButton
            aria-label="Filter-Dokumentation"
            size="medium"
            onClick={onClickInfo}
          >
            <MdInfoOutline />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
