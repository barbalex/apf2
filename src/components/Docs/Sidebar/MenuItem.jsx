import { useCallback } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router-dom'

export const MenuItem = ({ node }) => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const { slug, title } = node
  const activeUrl = `/Dokumentation/${slug}`
  const active = activeUrl === pathname || `${activeUrl}/` === pathname

  const onClickMenuItem = useCallback(() => {
    navigate(`${activeUrl}/${search}`)
  }, [activeUrl, navigate, search])

  return (
    <>
      <ListItemButton
        onClick={onClickMenuItem}
        selected={active}
        divider
        dense
        id={slug}
      >
        <ListItemText onClick={onClickMenuItem}>
          {title ?? '(Titel fehlt)'}
        </ListItemText>
      </ListItemButton>
    </>
  )
}
