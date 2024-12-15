import { useCallback, Suspense } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Menu } from './Menu.jsx'
import { query } from './query.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContentContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`
const TabContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const Component = () => {
  const { projId, apId, popId, tpopId, tpopkontrId } = useParams()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const { data, loading, error } = useQuery(query, {
    variables: { id: tpopkontrId },
  })

  const row = data?.tpopkontrById ?? {}

  const onChangeTab = useCallback(
    (event, value) =>
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/${value}${search}`,
      ),
    [projId, apId, popId, tpopId, tpopkontrId, navigate, search],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title="Feld-Kontrolle"
          menuBar={loading ? null : <Menu row={row} />}
        />
        <Tabs
          value={
            pathname.includes(`${tpopkontrId}/Entwicklung`) ? 'Entwicklung'
            : pathname.includes(`${tpopkontrId}/Dateien`) ?
              'Dateien'
            : pathname.includes(`${tpopkontrId}/Biotop`) ?
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
        <TabContentContainer>
          <TabContent>
            {loading ?
              <Spinner />
            : error ?
              <Error error={error} />
            : <Suspense fallback={<Spinner />}>
                <Outlet context={{ data }} />
              </Suspense>
            }
          </TabContent>
        </TabContentContainer>
      </Container>
    </ErrorBoundary>
  )
}
