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

import { MobxContext } from '../../../../../storeContext.js'

const height = 40

const Container = styled.div`
  padding: 4px 16px 4px 16px;
  ${(props) => (props.show === 'true' ? '' : 'display: none;')}
`
const StyledTextField = styled(TextField)`
  width: ${(props) => (props.width ?? 32) - 32}px;
`

export const FilterInput = memo(
  observer(({ width, filterInputIsVisible, ref: inputRef }) => {
    const store = useContext(MobxContext)
    const { nodeLabelFilter, activeFilterTable } = store.tree

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
          width={width}
          value={value}
          onChange={onChange}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          // autofocus leads to focus being stolen from other filter inputs
          // autoFocus={true}
          slotProps={{
            input: {
              endAdornment:
                showFilter ?
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
