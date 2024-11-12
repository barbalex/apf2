import { useCallback, Suspense, useMemo } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApolloClient, useQuery, gql } from '@apollo/client'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { query } from '../TpopmassnRouter/query.js'
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
  const { tpopmassnId, tpopId, popId, apId, projId } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: tpopmassnId,
    },
  })

  const row = useMemo(() => data?.tpopmassnById ?? {}, [data?.tpopmassnById])

  const onChangeTab = useCallback(
    (event, value) => {
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${tpopmassnId}/${value}`,
      )
    },
    [projId, apId, popId, tpopId, tpopmassnId, navigate],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title="Massnahme"
          menuBar={<Menu row={row} />}
        />
        <Tabs
          value={
            pathname.includes(`${tpopmassnId}/Massnahme`) ? 'Massnahme'
            : pathname.includes(`${tpopmassnId}/Dateien`) ?
              'Dateien'
            : 'Massnahme'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Massnahme"
            value="Massnahme"
            data-id="Massnahme"
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
