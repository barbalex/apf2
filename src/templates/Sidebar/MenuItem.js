import React, { useCallback } from 'react'
import { navigate } from 'gatsby'
import MListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import { Location } from '@reach/router'
import styled from 'styled-components'
import get from 'lodash/get'

const ListItem = styled(MListItem)`
  background-color: ${props =>
    props.active === 'true' ? 'rgb(255, 250, 198)' : 'unset'} !important;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`

const MenuItem = ({ node }) => {
  const onClickMenuItem = useCallback(
    () => navigate(`${node.frontmatter.path}/`),
    [node],
  )

  return (
    <Location>
      {({ location }) => {
        const active = (
          `${node.frontmatter.path}` === location.pathname ||
          `${node.frontmatter.path}/` === location.pathname
        ).toString()

        return (
          <>
            <ListItem button onClick={onClickMenuItem} active={active}>
              <ListItemText onClick={onClickMenuItem}>
                {get(node, 'frontmatter.title', '(Titel fehlt)')}
              </ListItemText>
            </ListItem>
            <Divider />
          </>
        )
      }}
    </Location>
  )
}

export default MenuItem
