import {
  memo,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FaTimes } from 'react-icons/fa'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'

import { MobxContext } from '../../../../../mobxContext.js'

const height = 40

const Container = styled.div`
  padding: 4px 16px 4px 16px;
  ${(props) => (props.show === 'true' ? '' : 'display: none;')}
`
const StyledTextField = styled(TextField)`
  width: ${(props) => (props.width ?? 32) - 32}px;
`

const isCoarsePointer = matchMedia('(pointer: coarse)').matches

export const FilterInput = memo(
  observer(({ width, filterInputIsVisible, ref: inputRef }) => {
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

    const setNodeLabelFilter = useCallback(
      (val) => {
        setNodeLabelFilterKey({
          value: val,
          key: activeFilterTable,
        })
      },
      [setNodeLabelFilterKey, activeFilterTable],
    )
    const setNodeLabelFilterDebounced = useDebouncedCallback(
      setNodeLabelFilter,
      600,
    )

    const onChange = useCallback(
      (e) => {
        // remove some values as they can cause exceptions in regular expressions
        const val = e.target.value.replaceAll('(', '').replaceAll(')', '')
        setValue(val)

        // on coarse pointer filter on enter, not debounced
        if (isCoarsePointer) return

        setNodeLabelFilterDebounced(val)
      },
      [setNodeLabelFilterDebounced, isCoarsePointer],
    )

    // issue: (https://github.com/barbalex/apf2/issues/710)
    // setting nodeLabelFilter rerenders the component, so focus has to be reset
    // on mobile this makes the keyboard disappear and reappear
    // thus better to filter on pressing enter
    const onKeyDown = useCallback(
      (e) => {
        if (!isCoarsePointer) return
        if (!e.key === 'Enter') return

        setNodeLabelFilter(value)
      },
      [setNodeLabelFilter, isCoarsePointer, value],
    )

    const onClickEmpty = useCallback(() => {
      setValue('')
      setNodeLabelFilter('')
      setTimeout(() => inputRef?.current?.focus?.(), 0)
    }, [setNodeLabelFilter])

    // if no activeFilterTable, show nothing
    if (!activeFilterTable) return null

    return (
      <Container show={filterInputIsVisible.toString()}>
        <StyledTextField
          inputRef={inputRef}
          label="Filter"
          variant="standard"
          width={width}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
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
        />
      </Container>
    )
  }),
)
