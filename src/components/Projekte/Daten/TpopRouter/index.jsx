import { useCallback, Suspense } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router'
import { useQuery, useApolloClient, gql } from '@apollo/client'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { query } from './query.js'
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
  // height: calc(100% - 48px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const Component = () => {
  const { tpopId } = useParams()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const {
    data,
    loading,
    error,
    refetch: refetchTpop,
  } = useQuery(query, {
    variables: {
      id: tpopId,
    },
  })

  const row = data?.tpopById ?? {}

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(tpopId) ?
        navigate(`./${value}${search}`)
      : navigate(`${value}${search}`),
    [pathname, tpopId, navigate, search],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title="Teil-Population"
          menuBar={<Menu row={row} />}
        />
        <Tabs
          value={
            pathname.includes(`${tpopId}/Teil-Population`) ? 'Teil-Population'
            : pathname.includes(`${tpopId}/EK`) ?
              'EK'
            : pathname.includes(`${tpopId}/Dateien`) ?
              'Dateien'
            : pathname.includes(`${tpopId}/Historien`) ?
              'Historien'
            : 'Teil-Population'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Teil-Population"
            value="Teil-Population"
            data-id="Teil-Population"
          />
          <StyledTab
            label="EK"
            value="EK"
            data-id="EK"
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
                <Outlet context={{ data, refetchTpop }} />
              </Suspense>
            }
          </TabContent>
        </TabContentContainer>
      </Container>
    </ErrorBoundary>
  )
}
