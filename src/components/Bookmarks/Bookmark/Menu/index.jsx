import { memo } from 'react'
import IconButton from '@mui/material/IconButton'
import { BsCaretDown } from 'react-icons/bs'
import styled from '@emotion/styled'

export const Menu = memo(() => {
  return (
    <IconButton>
      <BsCaretDown />
    </IconButton>
  )
})
