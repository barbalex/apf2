// file name need underscore
// otherwise weird things happen (edits are not registered)
// see: https://github.com/gatsbyjs/gatsby/issues/26554#issuecomment-677915552
import React from 'react'
import { Router } from '@reach/router'
import styled from 'styled-components'

import DatenPageComponent from './_DatenComponent'

const StyledRouter = styled(Router)`
  height: 100%;
`

// needed to build own component to pass down appbarheight

const DatenPageRouter = ({ appbarheight }) => (
  <StyledRouter>
    <DatenPageComponent path="*" appbarheight={appbarheight} />
  </StyledRouter>
)

export default DatenPageRouter
