import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router'
import Highlighter from 'react-highlight-words'

export const MenuItem = ({
  node,
  highlightSearchString,
}: {
  node: { id: string; label?: React.ReactNode }
  highlightSearchString?: string | null | undefined
}) => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const { id, label } = node
  const activeUrl = `/Dokumentation/${id}`
  const active = activeUrl === pathname || `${activeUrl}/` === pathname

  const onClickMenuItem = () => void navigate(`${activeUrl}/${search}`)

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
          {highlightSearchString ?
            <Highlighter
              searchWords={[highlightSearchString]}
              textToHighlight={label?.toString?.() ?? '(Titel fehlt)'}
            />
          : (label ?? '(Titel fehlt)')}
        </ListItemText>
      </ListItemButton>
    </>
  )
}
