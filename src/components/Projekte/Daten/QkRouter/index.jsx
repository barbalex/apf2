import { useCallback, Suspense } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/client'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  fieldset {
    padding-right: 30px;
  }
`

export const Component = () => {
  const { apId } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { apId },
    fetchPolicy: 'no-cache',
  })

  const qkCount = loading ? '...' : data?.allQks?.totalCount
  const apqkCount = loading ? '...' : data?.allApqks?.totalCount

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(apId) ? navigate(`./${value}`) : navigate(value),
    [pathname, apId, navigate],
  )
  const path = pathname.split('/').filter((el) => !!el)
  const lastPathEl = path.at(-1)

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Qualitätskontrollen" />
        <Tabs
          value={
            lastPathEl === 'ausfuehren' ? 'ausfuehren'
            : lastPathEl === 'waehlen' ?
              'waehlen'
            : 'ausfuehren'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="ausführen"
            value="ausfuehren"
            data-id="ausfuehren"
          />
          <StyledTab
            label={`auswählen${qkCount ? ` (${apqkCount}/${qkCount})` : ''}`}
            value="waehlen"
            data-id="waehlen"
          />
        </Tabs>
        <TabContent>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </TabContent>
      </Container>
    </ErrorBoundary>
  )
}
