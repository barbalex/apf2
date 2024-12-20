import { memo, useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FaTimes } from 'react-icons/fa'
import { useLocation } from 'react-router'
import styled from '@emotion/styled'

import { MobxContext } from '../../../mobxContext.js'

const Container = styled.div`
  padding: 0 10px 10px 10px;
`
const StyledIconButton = styled(IconButton)`
  color: white;
`
const StyledTextField = styled(TextField)`
  label,
  input {
    color: white;
  }
  .MuiFormLabel-root.Mui-focused {
    color: rgba(255, 255, 255, 0.7);
  }
  .MuiInputBase-root:before {
    border-bottom: 1px solid white;
  }
  .MuiInputBase-root.MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before {
    border-bottom: 2px solid white;
  }
`

export const FilterInput = memo(
  observer(({ filterInputIsVisible, ref: inputRef }) => {
    const store = useContext(MobxContext)
    const { nodeLabelFilter, activeFilterTable: activeFilterTableIn } =
      store.tree
    // ISSUE: doc is not covered by active node array
    // thus activeFilterTable is not set for /Dokumentation
    const { pathname } = useLocation()
    const isDocs = pathname.includes('/Dokumentation')
    const activeFilterTable = isDocs ? 'doc' : activeFilterTableIn

    const { setKey: setNodeLabelFilterKey, isFiltered: runIsFiltered } =
      nodeLabelFilter
    const isFiltered = runIsFiltered()
    const showFilter = isFiltered

    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    const [value, setValue] = useState(filterValue)
    useEffect(() => {
      if (filterValue === value) return
      setValue(filterValue)
    }, [filterValue])

    const setNodeLabelFilterAfterChange = useCallback(
      (val) => {
        setNodeLabelFilterKey({
          value: val,
          key: activeFilterTable,
        })
      },
      [setNodeLabelFilterKey, activeFilterTable],
    )
    const setNodeLabelFilterDebounced = useDebouncedCallback(
      setNodeLabelFilterAfterChange,
      600,
    )

    const onChange = useCallback(
      (e) => {
        // remove some values as they can cause exceptions in regular expressions
        const val = e.target.value.replaceAll('(', '').replaceAll(')', '')

        setValue(val)
        setNodeLabelFilterDebounced(val)
      },
      [setNodeLabelFilterDebounced],
    )

    const onClickEmpty = useCallback(() => {
      setValue('')
      setNodeLabelFilterAfterChange('')
      setTimeout(() => inputRef?.current?.focus?.(), 0)
    }, [setNodeLabelFilterAfterChange])

    // if no activeFilterTable, show nothing
    if (!activeFilterTable) return null

    return (
      <Container show={filterInputIsVisible.toString()}>
        <StyledTextField
          inputRef={inputRef}
          label="Filter"
          variant="standard"
          fullWidth
          value={value}
          onChange={onChange}
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
                showFilter ?
                  <InputAdornment position="end">
                    <Tooltip title="Filter entfernen">
                      <StyledIconButton
                        aria-label="Filter entfernen"
                        onClick={onClickEmpty}
                        fontSize="small"
                      >
                        <FaTimes />
                      </StyledIconButton>
                    </Tooltip>
                  </InputAdornment>
                : null,
            },
          }}
        />
      </Container>
    )
  }),
)
