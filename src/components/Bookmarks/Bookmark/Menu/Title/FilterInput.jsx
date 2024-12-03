import { memo, useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { FaTimes } from 'react-icons/fa'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'
import { motion, useAnimation } from 'framer-motion'

import { StoreContext } from '../../../../../storeContext.js'

const height = 40

const Wrapper = styled.div`
  display: block;
  // position: relative;
  overflow: hidden;
`
const Input = styled.input`
  outline: none;
  border: none;
  border-radius: 2px;
  height: 24px;
  padding: 0 25px 0 22px;
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

export const FilterInput = memo(
  observer(({ isFiltering }) => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter, activeFilterTable } = store.tree

    const animHeight = useAnimation()

    const { setKey: setNodeLabelFilterKey, isFiltered: runIsFiltered } =
      nodeLabelFilter
    const isFiltered = runIsFiltered()

    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    const [value, setValue] = useState(filterValue)
    useEffect(() => {
      setValue(filterValue)
    }, [filterValue])

    const fadeOutInput = useCallback(async () => {
      await animHeight.start({ height })
    }, [])
    const fadeInInput = useCallback(async () => {
      await animHeight.start({ height: 0 })
    }, [animHeight])
    useEffect(() => {
      if (isFiltering) return fadeInInput()
      fadeOutInput()
    }, [isFiltering])

    const onBlurInput = useCallback(() => {
      if (value === '') fadeOutInput()
    }, [value])

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
      fadeOutInput()
    }, [setNodeLabelFilterAfterChange])

    // if no activeFilterTable, show nothing
    if (!activeFilterTable) return null

    return (
      <motion.div
        animate={animHeight}
        transition={{ type: 'just', duration: 0.2 }}
      >
        <Tooltip
          title="Filter"
          disableFocusListener={true}
        >
          <Input
            value={value}
            onChange={onChange}
            onBlur={onBlurInput}
            autoFocus={true}
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
      </motion.div>
    )
  }),
)
