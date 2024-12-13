import { useCallback, Suspense, useMemo } from 'react'
import styled from '@emotion/styled'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router'
import { useApolloClient, useQuery, gql } from '@apollo/client'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { query } from './query.js'
import { Menu } from '../ApRouter/Menu.jsx'

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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const TabContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const Component = () => {
  const { apId } = useParams()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const { data, error, loading } = useQuery(query, {
    variables: { id: apId },
  })

  const row = useMemo(() => data?.apById ?? {}, [data?.apById])

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(apId) ?
        navigate(`${value}${search}`)
      : navigate(`../${value}${search}`),
    [pathname, apId, navigate, search],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title="Art"
          menuBar={<Menu />}
        />
        <Tabs
          value={
            pathname.includes(`${apId}/Art`) ? 'Art'
            : pathname.includes(`${apId}/Auswertung`) ?
              'Auswertung'
            : pathname.includes(`${apId}/Dateien`) ?
              'Dateien'
            : pathname.includes(`${apId}/Historien`) ?
              'Historien'
            : 'Art'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Art"
            value="Art"
            data-id="Art"
          />
          <StyledTab
            label="Auswertung"
            value="Auswertung"
            data-id="Auswertung"
          />
          <StyledTab
            label="Dateien"
            value="Dateien"
            data-id="Dateien"
          />
          <StyledTab
            label="Historien"
            value="Historien"
            data-id="Historien"
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
