import { useCallback, Suspense } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  height: 100%;
  overflow: hidden !important;
  overflow-y: auto;
  scrollbar-width: thin;
  fieldset {
    padding-right: 30px;
  }
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
  const { pathname } = useLocation()

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(tpopId) ? navigate(`./${value}`) : navigate(value),
    [tpopId, navigate],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Teil-Population" />
        <FieldsContainer>
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
              <Suspense fallback={<Spinner />}>
                <Outlet />
              </Suspense>
            </TabContent>
          </TabContentContainer>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}
