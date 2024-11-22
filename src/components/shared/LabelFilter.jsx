import { memo, useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { FaTimes } from 'react-icons/fa'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'
import { motion, useAnimation } from 'framer-motion'

import { StoreContext } from '../../storeContext.js'
import { listLabelFilterIsIconAtom } from '../../JotaiStore/index.js'

export const labelFilterWidth = 192
import { buttonWidth } from './MenuBar/index.jsx'
const inputWidth = labelFilterWidth - 47

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
  width: ${inputWidth}px;
  max-width: ${inputWidth}px;
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

    const anim = useAnimation()

    const { setKey: setNodeLabelFilterKey, isFiltered: runIsFiltered } =
      nodeLabelFilter
    const isFiltered = runIsFiltered()

    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    const [value, setValue] = useState(filterValue)
    useEffect(() => {
      setValue(filterValue)
    }, [filterValue])

    const [isIcon, setIsIcon] = useAtom(listLabelFilterIsIconAtom)
    const fadeOutInput = useCallback(async () => {
      await anim.start({ width: buttonWidth })
      setIsIcon(true)
    }, [setIsIcon])
    const fadeInInput = useCallback(async () => {
      await anim.start({ width: labelFilterWidth })
      setIsIcon(false)
    }, [anim])

    const onBlurInput = useCallback(() => {
      if (value === '') fadeOutInput()
    }, [value, setIsIcon])

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
        animate={anim}
        transition={{ type: 'just', duration: 0.2 }}
      >
        {isIcon ?
          <Tooltip title="Filtern">
            <IconButton
              aria-label="Filtern"
              onClick={() => {
                setValue('')
                setNodeLabelFilterAfterChange('')
                fadeInInput()
              }}
            >
              <MdFilterAlt style={iconStyle} />
            </IconButton>
          </Tooltip>
        : <Wrapper>
            <Tooltip
              title="Filter"
              disableFocusListener={true}
            >
              <Input
                value={value}
                onChange={onChange}
                onBlur={onBlurInput}
                // ref={inputRef}
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
          </Wrapper>
        }
      </motion.div>
    )
  }),
)
