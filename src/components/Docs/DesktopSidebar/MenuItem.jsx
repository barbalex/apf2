import { useCallback } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router'

export const MenuItem = ({ node }) => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const { id, label } = node
  const activeUrl = `/Dokumentation/${id}`
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
        id={id}
      >
        <ListItemText onClick={onClickMenuItem}>
          {label ?? '(Titel fehlt)'}
        </ListItemText>
      </ListItemButton>
    </>
  )
}
