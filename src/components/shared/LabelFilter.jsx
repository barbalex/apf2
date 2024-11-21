import { memo, useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdSearch } from 'react-icons/md'

import { StoreContext } from '../../storeContext.js'

const iconStyle = { color: 'white' }

export const LabelFilter = memo(
  observer(() => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter, activeFilterTable } = store.tree
    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    const {
      setKey: setNodeLabelFilterKey,
      isFiltered: runIsFiltered,
      empty,
    } = nodeLabelFilter
    const isFiltered = runIsFiltered()

    const setNodeLabelFilterAfterChange = useCallback(
      (val) =>
        setNodeLabelFilterKey({
          value: val,
          key: activeFilterTable,
        }),
      [setNodeLabelFilterKey, activeFilterTable],
    )
    const setNodeLabelFilterDebounced = useDebouncedCallback(
      setNodeLabelFilterAfterChange,
      600,
    )

    const [value, setValue] = useState(filterValue)
    const onChange = useCallback(
      (e) => {
        // remove some values as they can cause exceptions in regular expressions
        const val = e.target.value.replaceAll('(', '').replaceAll(')', '')

        setValue(val)
        setNodeLabelFilterDebounced(val)
      },
      [setNodeLabelFilterDebounced],
    )

    const [isIcon, setIsIcon] = useState(filterValue !== '')

    console.log('LabelFilter', {
      filterValue,
      activeFilterTable,
      nodeLabelFilter: nodeLabelFilter?.toJSON(),
      isFiltered,
    })

    // if no activeFilterTable, show nothing
    if (!activeFilterTable) return null

    // if isIcon, show search icon
    if (isIcon) {
      return (
        <Tooltip title="Filtern">
          <IconButton
            aria-label="Filtern"
            onClick={() => {
              setValue('')
              setNodeLabelFilterAfterChange('')
              setIsIcon(false)
            }}
          >
            <MdSearch style={iconStyle} />
          </IconButton>
        </Tooltip>
      )
    }

    // show search input
    return (
      <span
        onClick={() => {
          setIsIcon(true)
        }}
      >
        Filtern
      </span>
    )
  }),
)
