import { FaCog } from 'react-icons/fa'
import styled from '@emotion/styled'
import IconButton from '@mui/material/IconButton'

const Container = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`

const TreeMenu = () => {
  return (
    <Container>
      <IconButton size="small" title="Einstellungen">
        <FaCog />
      </IconButton>
    </Container>
  )
}

export default TreeMenu
