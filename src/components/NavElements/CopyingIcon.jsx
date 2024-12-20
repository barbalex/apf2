import styled from '@emotion/styled'
import { MdContentCopy } from 'react-icons/md'

import { IconContainer } from './IconContainer.jsx'

const StyledIcon = styled(MdContentCopy)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`

export const CopyingIcon = () => (
  <IconContainer title="kopiert, bereit zum Einfügen">
    <StyledIcon />
  </IconContainer>
)
