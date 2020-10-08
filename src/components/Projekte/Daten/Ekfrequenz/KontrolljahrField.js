import React, { useEffect, useRef, useCallback } from 'react'
import Input from '@material-ui/core/Input'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useField } from 'formik'

const StyledInput = styled(Input)`
  width: 45px;
  touch-action: none;
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const MyTextField = ({ handleSubmit, ...props }) => {
  const [field] = useField(props)
  const { onChange, onBlur, value, name } = field

  // only working solution
  // see: https://github.com/mui-org/material-ui/issues/7960#issuecomment-497945204
  const textFieldRef = useRef(null)
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    const current = textFieldRef.current
    current.addEventListener('wheel', handleWheel)

    return () => {
      current.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const onKeyDown = useCallback((e) => e.key === 'Enter' && handleSubmit(), [
    handleSubmit,
  ])

  return (
    <StyledInput
      id={name}
      ref={textFieldRef}
      name={name}
      value={value || value === 0 ? value : ''}
      type="number"
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      autoFocus={!(value || value === 0)}
    />
  )
}

export default observer(MyTextField)
