import React, { useCallback } from 'react'
import { navigate } from 'gatsby'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation } from '@reach/router'

const MenuItem = ({ node }) => {
  const location = useLocation()
  const activeUrl = `/Dokumentation/${node.frontmatter.slug}`
  const active =
    activeUrl === location.pathname || `${activeUrl}/` === location.pathname

  const onClickMenuItem = useCallback(
    () => navigate(`${activeUrl}/`),
    [activeUrl],
  )

  return (
    <>
      <ListItemButton onClick={onClickMenuItem} selected={active} divider dense>
        <ListItemText onClick={onClickMenuItem}>
          {node?.frontmatter?.title ?? '(Titel fehlt)'}
        </ListItemText>
      </ListItemButton>
    </>
  )
}

export default MenuItem
