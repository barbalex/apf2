import { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FaTimes } from 'react-icons/fa'
import { useLocation } from 'react-router'
import { styled } from '@mui/material/styles'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  treeActiveFilterTableAtom,
  treeNodeLabelFilterAtom,
  treeSetNodeLabelFilterKeyAtom,
  treeEmptyNodeLabelFilterAtom,
} from '../../../store/index.ts'
import styles from './FilterInput.module.css'

// https://mui.com/material-ui/react-menu/#customization
const StyledTextField = styled((props) => <TextField {...props} />)(() => ({
  label: { color: 'white' },
  input: { color: 'white' },
  '& .MuiFormLabel-root.Mui-focused': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-root:before': {
    borderBottom: '1px solid white',
  },
  '& .MuiInputBase-root.MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before':
    {
      borderBottom: '2px solid white',
    },
}))

export const FilterInput = ({ toggleFilterInputIsVisible, ref: inputRef }) => {
  // ISSUE: doc is not covered by active node array
  // thus activeFilterTable is not set for /Dokumentation
  const { pathname } = useLocation()
  const isDocs = pathname.includes('/Dokumentation')
  const activeFilterTableIn = useAtomValue(treeActiveFilterTableAtom)
  const activeFilterTable = isDocs ? 'doc' : activeFilterTableIn
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const setNodeLabelFilterKey = useSetAtom(treeSetNodeLabelFilterKeyAtom)
  const empty = useSetAtom(treeEmptyNodeLabelFilterAtom)

  const isFiltered = Object.values(nodeLabelFilter).some(
    (v) => v !== null && v !== '',
  )

  const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
  const [value, setValue] = useState(filterValue)
  // value should update when changed from outside
  useEffect(() => {
    if (filterValue === value) return
    setValue(filterValue)
  }, [filterValue])

  const setNodeLabelFilter = (val) => {
    if (!activeFilterTable) return
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
    toggleFilterInputIsVisible()
    setValue('')
    setNodeLabelFilter('')
  }

  // if no activeFilterTable, show nothing
  if (!activeFilterTable) return null

  return (
    <div className={styles.container}>
      <StyledTextField
        inputRef={inputRef}
        label="Filter"
        variant="standard"
        fullWidth
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        // autofocus leads to focus being stolen from other filter inputs
        // but necessary because rerenders happen (?)
        autoFocus={true}
        slotProps={{
          input: {
            endAdornment:
              isFiltered || value?.length ?
                <InputAdornment position="end">
                  <Tooltip title="Filter entfernen">
                    <IconButton
                      aria-label="Filter entfernen"
                      onClick={onClickEmpty}
                      fontSize="small"
                      className={styles.iconButton}
                    >
                      <FaTimes />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              : null,
          },
        }}
      />
    </div>
  )
}
