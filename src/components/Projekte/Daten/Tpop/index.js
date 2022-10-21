import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

import FormTitle from '../../../shared/FormTitle'
import query from './query'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import Ek from './Ek'
import Tpop from './Tpop'
import TpopHistory from './History'
import Files from '../../../shared/Files'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import {
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  height: 100%;
  overflow: hidden !important;
  overflow-y: auto;
  fieldset {
    padding-right: 30px;
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: calc(100% - 48px);
`

const fieldTypes = {
  popId: 'UUID',
  nr: 'Int',
  gemeinde: 'String',
  flurname: 'String',
  radius: 'Int',
  hoehe: 'Int',
  exposition: 'String',
  klima: 'String',
  neigung: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  bodenAbtrag: 'String',
  wasserhaushalt: 'String',
  beschreibung: 'String',
  katasterNr: 'String',
  status: 'Int',
  statusUnklarGrund: 'String',
  apberRelevant: 'Boolean',
  apberRelevantGrund: 'Int',
  bekanntSeit: 'Int',
  eigentuemer: 'String',
  kontakt: 'String',
  nutzungszone: 'String',
  bewirtschafter: 'String',
  bewirtschaftung: 'String',
  ekfrequenz: 'UUID',
  ekfrequenzAbweichend: 'Boolean',
  ekfKontrolleur: 'UUID',
  ekfrequenzStartjahr: 'Int',
  bemerkungen: 'String',
  statusUnklar: 'Boolean',
}

const TpopForm = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store

  const { activeNodeArray } = store[treeName]
  const [tab, setTab] = useState(urlQuery?.tpopTab ?? 'tpop')
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'tpopTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  let id =
    activeNodeArray.length > 7
      ? activeNodeArray[7]
      : '99999999-9999-9999-9999-999999999999'
  const {
    data,
    loading,
    error,
    refetch: refetchTpop,
  } = useQuery(query, {
    variables: {
      id,
    },
  })
  const apJahr = data?.tpopById?.popByPopId?.apByApId?.startJahr ?? null

  const row = data?.tpopById ?? {}

  const [fieldErrors, setFieldErrors] = useState({})
  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateTpop${field}(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpop {
                  ...TpopFields
                  popStatusWerteByStatus {
                    ...PopStatusWerteFields
                  }
                  tpopApberrelevantGrundWerteByApberRelevantGrund {
                    ...TpopApberrelevantGrundWerteFields
                  }
                  popByPopId {
                    id
                    apId
                  }
                }
              }
            }
            ${popStatusWerte}
            ${tpop}
            ${tpopApberrelevantGrundWerte}
          `,
          variables,
          // no optimistic responce as geomPoint
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      // update tpop on map
      if (
        (value &&
          ((field === 'ylv95Y' && row?.lv95X) ||
            (field === 'lv95X' && row?.y))) ||
        (!value && (field === 'ylv95Y' || field === 'lv95X'))
      ) {
        
      client.refetchQueries({
        include: ['TpopForMapQuery', 'PopForMapQuery'],
      })
      }
      if (Object.keys(fieldErrors).length) {
        setFieldErrors({})
      }
    },
    [client, fieldErrors, row.id, row?.lv95X, row?.y, store.user.name],
  )

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={data?.tpopById?.popByPopId?.apId}
          title="Teil-Population"
          treeName={treeName}
        />
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab label="Teil-Population" value="tpop" data-id="tpop" />
            <StyledTab label="EK" value="ek" data-id="ek" />
            <StyledTab label="Dateien" value="dateien" data-id="dateien" />
            <StyledTab label="Historien" value="history" data-id="history" />
          </Tabs>
          <TabContent>
            {tab === 'tpop' ? (
              <Tpop
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                row={row}
                apJahr={apJahr}
                refetchTpop={refetchTpop}
                treeName={treeName}
                loadingParent={loading}
              />
            ) : tab === 'ek' ? (
              <Ek
                treeName={treeName}
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                row={row}
                loadingParent={loading}
              />
            ) : tab === 'dateien' ? (
              <Files parentId={row?.id} parent="tpop" loadingParent={loading} />
            ) : (
              <TpopHistory tpopId={id} />
            )}
          </TabContent>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TpopForm)
