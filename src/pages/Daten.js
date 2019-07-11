import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import Layout from '../components/Layout'
import storeContext from '../storeContext'
import Projekte from '../components/Projekte'
import User from '../components/User'
import Messages from '../components/Messages'
import Ekf from '../components/Ekf'
import Deletions from '../components/Deletions'
import EkPlan from '../components/EkPlan'

const Container = styled.div`
  background-color: #fffde7;
  @media print {
    margin-top: 0;
    height: auto;
    overflow: visible !important;
    background-color: white;
  }
`

const DatenPage = ({ location }) => {
  const store = useContext(storeContext)
  const { view, showDeletions, user } = store
  const { activeForm } = store.tree

  const form = useMemo(
    () =>
      activeForm.form === 'ekplan'
        ? 'ekplan'
        : view === 'ekf'
        ? 'ekf'
        : 'projekte',
    [activeForm.form, view],
  )

  console.log('page Daten rendering')

  return (
    <ErrorBoundary>
      <Layout>
        <Container>
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
      </Layout>
    </ErrorBoundary>
  )
}

export default observer(DatenPage)
