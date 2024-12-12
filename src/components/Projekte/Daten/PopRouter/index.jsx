import { useCallback, Suspense, useMemo } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router'
import { useApolloClient, useQuery, gql } from '@apollo/client'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { query } from '../PopRouter/query.js'
import { Menu } from './Menu.jsx'

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
  const { projId, apId, popId } = useParams()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const {
    data,
    loading,
    error,
    refetch: refetchPop,
  } = useQuery(query, {
    variables: {
      id: popId,
    },
  })

  const row = useMemo(() => data?.popById ?? {}, [data?.popById])

  const onChangeTab = useCallback(
    (event, value) =>
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/${value}${search}`,
      ),
    [projId, apId, popId, search, navigate],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title="Population"
          menuBar={<Menu row={row} />}
        />
        <Tabs
          value={
            pathname.includes(`${popId}/Population`) ? 'Population'
            : pathname.includes(`${popId}/Auswertung`) ?
              'Auswertung'
            : pathname.includes(`${popId}/Dateien`) ?
              'Dateien'
            : pathname.includes(`${popId}/Historien`) ?
              'Historien'
            : 'Population'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Population"
            value="Population"
            data-id="Population"
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
                <Outlet context={{ data, refetchPop }} />
              </Suspense>
            }
          </TabContent>
        </TabContentContainer>
      </Container>
    </ErrorBoundary>
  )
}
