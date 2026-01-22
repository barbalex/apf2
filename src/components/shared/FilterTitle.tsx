import { useContext } from 'react'
import { FaTrash, FaTrashAlt, FaRegTrashAlt } from 'react-icons/fa'
import { MdInfoOutline } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../mobxContext.ts'
import { exists } from '../../modules/exists.ts'
import { appBaseUrl } from '../../modules/appBaseUrl.ts'
import { tableIsFiltered } from '../../modules/tableIsFiltered.ts'

import styles from './FilterTitle.module.css'

export const FilterTitle = observer(
  ({ title, table, totalNr, filteredNr, activeTab }) => {
    const store = useContext(MobxContext)
    const {
      emptyMapFilter,
      dataFilterEmpty,
      dataFilterEmptyTab,
      dataFilterEmptyTable,
      setApFilter,
    } = store.tree

    const existsTableFilter = tableIsFiltered({ table, tree: store.tree })
    const tables = Object.keys(store.tree.dataFilter)
    const existsTreeFilter = tables.some((table) =>
      tableIsFiltered({ table, tree: store.tree }),
    )
    console.log('FilterTitle', { tables, existsTreeFilter, existsTableFilter })

    const onEmptyTab = () => dataFilterEmptyTab({ table, activeTab })
    const onEmptyTable = () => dataFilterEmptyTable({ table })

    const onEmptyTree = () => {
      store.tree.nodeLabelFilter.empty()
      dataFilterEmpty()
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
  },
)
