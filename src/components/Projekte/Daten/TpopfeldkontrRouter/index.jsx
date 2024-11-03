import { useCallback, Suspense } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-of-type {
    > div:first-of-type {
      display: block !important;
    }
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: 100%;
`

export const Component = () => {
  const { tpopkontrId } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(tpopkontrId) ? navigate(`./${value}`) : navigate(value),
    [tpopkontrId, navigate, pathname],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Feld-Kontrolle" />
        <FieldsContainer>
          <Tabs
            value={
              pathname.endsWith('Entwicklung') ? 'Entwicklung'
              : pathname.endsWith('Dateien') ?
                'Dateien'
              : pathname.endsWith('Biotop') ?
                'Biotop'
              : 'Entwicklung'
            }
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab
              label="Entwicklung"
              value="Entwicklung"
              data-id="Entwicklung"
            />
            <StyledTab
              label="Biotop"
              value="Biotop"
              data-id="Biotop"
            />
            <StyledTab
              label="Dateien"
              value="Dateien"
              data-id="Dateien"
            />
          </Tabs>
          <div style={{ overflowY: 'auto' }}>
            <TabContent>
              <Suspense fallback={<Spinner />}>
                <Outlet />
              </Suspense>
            </TabContent>
          </div>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}
