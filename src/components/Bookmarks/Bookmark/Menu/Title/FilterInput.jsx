import { useContext, useState, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FaTimes } from 'react-icons/fa'
import { MdFilterAlt } from 'react-icons/md'

import { MobxContext } from '../../../../../mobxContext.js'

import { container } from './FilterInput.module.css'

export const FilterInput = observer(
  ({ width, filterInputIsVisible, toggleFilterInput, ref: inputRef }) => {
    const store = useContext(MobxContext)
    const { nodeLabelFilter, activeFilterTable } = store.tree

    const { setKey: setNodeLabelFilterKey, isFiltered: runIsFiltered } =
      nodeLabelFilter
    const isFiltered = runIsFiltered()

    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    const [value, setValue] = useState(filterValue)
    // value should update when changed from outside
    useEffect(() => {
      if (filterValue === value) return
      setValue(filterValue)
    }, [filterValue])

    const setNodeLabelFilter = (val) => {
      setNodeLabelFilterKey({
        value: val,
        key: activeFilterTable,
      })
    }

    const onChange = (e) => {
      // remove some values as they can cause exceptions in regular expressions
      const val = e.target.value.replaceAll('(', '').replaceAll(')', '')
      setValue(val)
    }

    const onKeyUp = (e) => {
      if (e.key === 'Enter') {
        setNodeLabelFilter(value)
        // on coarse pointers, move focus out to close the keyboard
        if (matchMedia('(pointer: coarse)').matches) {
          inputRef.current.blur()
        }
      }
    }

    const onClickEmpty = () => {
      toggleFilterInput()
      setValue('')
      setNodeLabelFilter('')
    }

    // if no activeFilterTable, show nothing
    if (!activeFilterTable) return null

    return (
      <div
        className={container}
        style={filterInputIsVisible ? {} : { display: 'none' }}
      >
        <TextField
          inputRef={inputRef}
          label="Filter"
          variant="standard"
          value={value}
          onChange={onChange}
          onKeyUp={onKeyUp}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          // autofocus leads to focus being stolen from other filter inputs
          // autoFocus={true}
          slotProps={{
            input: {
              endAdornment:
                isFiltered || value.length ?
                  <InputAdornment position="end">
                    <Tooltip title="Filter entfernen">
                      <IconButton
                        aria-label="Filter entfernen"
                        onClick={onClickEmpty}
                        fontSize="small"
                      >
                        <FaTimes />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                : null,
            },
          }}
          style={{ width: (width ?? 32) - 32 }}
        />
      </div>
    )
  },
)
