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
import { FaTimes } from 'react-icons/fa'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { StoreContext } from '../../storeContext.js'
import { listLabelFilterIsIconAtom } from '../../JotaiStore/index.js'

export const labelFilterWidth = 192

const Wrapper = styled.div`
  display: block;
  position: relative;
  overflow: hidden;
`
const Input = styled.input`
  outline: none;
  border: none;
  border-radius: 2px;
  height: 24px;
  padding: 0 25px 0 22px;
  width: ${labelFilterWidth - 47}px;
  max-width: ${labelFilterWidth - 47}px;
  &:focus-visible {
    outline: 3px solid rgb(46, 125, 50);
  }
`
const InputEndIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`
const InputStartIcon = styled.div`
  position: absolute;
  height: 24px;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.54);
  display: flex;
  align-items: center;
  margin-top: -0.5px;
  svg {
    height: 18px;
    width: 18px;
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

    const [isIcon, setIsIcon] = useAtom(listLabelFilterIsIconAtom)
    useEffect(() => {
      setValue(filterValue)
    }, [filterValue])

    const onBlurInput = useCallback(() => {
      if (value === '') {
        setIsIcon(true)
      }
    }, [value, setIsIcon])

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

    const onClickEmpty = useCallback(() => {
      setValue('')
      setNodeLabelFilterAfterChange('')
      setIsIcon(true)
    }, [setNodeLabelFilterAfterChange])

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
            <MdFilterAlt style={iconStyle} />
          </IconButton>
        </Tooltip>
      )
    }

    // show search input
    return (
      <Wrapper>
        <Tooltip
          title="Filter"
          disableFocusListener={true}
        >
          <Input
            value={value}
            onChange={onChange}
            onBlur={onBlurInput}
            ref={inputRef}
          />
        </Tooltip>
        <InputEndIcon>
          <Tooltip title="Filter entfernen">
            <IconButton
              size="small"
              aria-label="Filter entfernen"
              onClick={onClickEmpty}
            >
              <FaTimes />
            </IconButton>
          </Tooltip>
        </InputEndIcon>
        <InputStartIcon>
          <MdFilterAlt />
        </InputStartIcon>
      </Wrapper>
    )
  }),
)
