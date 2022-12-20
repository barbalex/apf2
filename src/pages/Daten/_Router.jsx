// file name need underscore
// otherwise weird things happen (edits are not registered)
// see: https://github.com/gatsbyjs/gatsby/issues/26554#issuecomment-677915552
import React, { useContext } from 'react'
import { Router } from '@reach/router'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import DatenPageComponent from './_DatenComponent'
import storeContext from '../../storeContext'

const StyledRouter = styled(Router)`
  ${(props) => !props.flex && 'height:100%;'}
  ${(props) => props.flex && 'flex:1;'}
`

// needed to build own component to pass down appbarheight

// Reach-router add extra div: https://github.com/reach/router/issues/63
// also: https://github.com/gatsbyjs/gatsby/issues/7310#issuecomment-1359863635
// height: 100% or 100vh removes layout when filtering in ekTable
// see: https://github.com/barbalex/apf2/issues/577#issue-1496916662
// flex: 1 works for ekTable and docs but not for data
// HACK: use flex: 1 only for ekPlan

const DatenPageRouter = ({ appbarheight }) => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store.tree

  const isEkPlan =
    activeNodeArray.length === 3 &&
    activeNodeArray[0] === 'Projekte' &&
    activeNodeArray[2] === 'EK-Planung'

  return (
    <StyledRouter flex={isEkPlan}>
      <DatenPageComponent path="*" appbarheight={appbarheight} />
    </StyledRouter>
  )
}

export default observer(DatenPageRouter)
