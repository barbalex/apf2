import { memo } from 'react'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router'

import { StyledButton } from './index.jsx'

const style = { marginRight: 8 }

export const Dokumentation = memo(() => {
  const { pathname, search } = useLocation()
  const isDocs = pathname.startsWith('/Dokumentation')

  return (
    <StyledButton
      variant={isDocs ? 'outlined' : 'text'}
      component={Link}
      to={`/Dokumentation/${search}`}
      border={isDocs.toString()}
      style={style}
    >
      Dokumentation
    </StyledButton>
  )
})
