import styled from '@emotion/styled'
import { MdPhotoLibrary } from 'react-icons/md'

import { IconContainer } from './IconContainer.jsx'

const StyledIcon = styled(MdPhotoLibrary)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
  align-self: flex-start;
`

export const BiotopCopyingIcon = () => (
  <IconContainer
    title="Biotop kopiert, bereit zum Einfügen"
    className="iconContainer"
  >
    <StyledIcon />
  </IconContainer>
)
