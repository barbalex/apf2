// file name need underscore
// otherwise weird things happen (edits are not registered)
// see: https://github.com/gatsbyjs/gatsby/issues/26554#issuecomment-677915552
import React, { useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'
import Projekte from '../../components/Projekte'
import User from '../../components/User'
import Messages from '../../components/Messages'
import Ekf from '../../components/Ekf'
import Deletions from '../../components/Deletions'
import EkPlan from '../../components/EkPlan'

const Container = styled.div`
  background-color: #fffde7;
  height: 100%;

  @media print {
    margin-top: 0;
    height: auto;
    overflow: visible !important;
    background-color: white;
  }
`

const DatenPageComponent = () => {
  const store = useContext(storeContext)
  const { view, showDeletions, user } = store
  const { activeNodeArray } = store.tree

  const isEkPlan =
    activeNodeArray.length === 3 &&
    activeNodeArray[0] === 'Projekte' &&
    activeNodeArray[2] === 'EK-Planung'
  const form = useMemo(
    () => (isEkPlan ? 'ekplan' : view === 'ekf' ? 'ekf' : 'projekte'),
    [isEkPlan, view],
  )

  // using render props on Layout to pass down appbarheight without using store
  return (
    <Container  path="/*">
      {!!user.token && (
        <>
          {form === 'ekf' && <Ekf />}
          {form === 'projekte' && <Projekte />}
          {form === 'ekplan' && <EkPlan />}
          <Messages />
          {showDeletions && <Deletions />}
        </>
      )}
      <User />
    </Container>
  )
}

export default observer(DatenPageComponent)
