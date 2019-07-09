import React, { useCallback } from 'react'
import Input from '@material-ui/core/Input'
//import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const MyTextField = ({ field, form }) => {
  const { onChange, onBlur, value, name } = field
  const { handleSubmit } = form

  const onKeyPress = useCallback(event => {
    event.key === 'Enter' && handleSubmit()
  })

  return (
    <Input
      id={name}
      name={name}
      value={value || ''}
      type="number"
      onChange={onChange}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      onWheel={event => {
        event.preventDefault()
      }}
    />
  )
}

export default observer(MyTextField)
