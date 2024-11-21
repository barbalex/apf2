import {
  memo,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdSearch } from 'react-icons/md'
import styled from '@emotion/styled'

import { StoreContext } from '../../storeContext.js'
import { set } from 'lodash'

const Input = styled.input`
  outline: none;
  border: none;
  border-radius: 2px;
  height: 24px;
  padding: 0 5px;
  &:focus-visible {
    outline: 3px solid rgb(46, 125, 50);
  }
`
const iconStyle = { color: 'white' }

export const LabelFilter = memo(
  observer(() => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter, activeFilterTable } = store.tree

    const { setKey: setNodeLabelFilterKey, isFiltered: runIsFiltered } =
      nodeLabelFilter
    const isFiltered = runIsFiltered()

    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    const [value, setValue] = useState(filterValue)
    const [isIcon, setIsIcon] = useState(!isFiltered && value === '')
    useEffect(() => {
      setValue(filterValue)
      setIsIcon(!isFiltered && filterValue === '')
    }, [filterValue])

    console.log('LabelFilter, filterValue:', filterValue)

    const inputRef = useRef(null)

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

    const onChange = useCallback(
      (e) => {
        // remove some values as they can cause exceptions in regular expressions
        const val = e.target.value.replaceAll('(', '').replaceAll(')', '')

        setValue(val)
        setNodeLabelFilterDebounced(val)
      },
      [setNodeLabelFilterDebounced],
    )

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
              setTimeout(() => {
                inputRef.current.focus()
              }, 0)
            }}
          >
            <MdSearch style={iconStyle} />
          </IconButton>
        </Tooltip>
      )
    }

    // show search input
    return (
      <Input
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
    )
  }),
)
