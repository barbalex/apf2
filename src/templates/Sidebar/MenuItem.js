import React, { useCallback } from 'react'
import { navigate } from 'gatsby'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { Location } from '@reach/router'

const MenuItem = ({ node }) => {
  const onClickMenuItem = useCallback(
    () => navigate(`${node.frontmatter.path}/`),
    [node],
  )

  return (
    <Location>
      {({ location }) => {
        const active =
          `${node.frontmatter.path}` === location.pathname ||
          `${node.frontmatter.path}/` === location.pathname

        return (
          <>
            <ListItemButton onClick={onClickMenuItem} selected={active} divider>
              <ListItemText onClick={onClickMenuItem}>
                {node?.frontmatter?.title ?? '(Titel fehlt)'}
              </ListItemText>
            </ListItemButton>
          </>
        )
      }}
    </Location>
  )
}

export default MenuItem
