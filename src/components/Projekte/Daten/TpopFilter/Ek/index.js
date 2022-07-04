import React, { useContext } from 'react'
import styled from 'styled-components'
import max from 'lodash/max'
import groupBy from 'lodash/groupBy'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import Checkbox2States from '../../../../shared/Checkbox2States'
import RadioButtonGroup from '../../../../shared/RadioButtonGroup'
import Select from '../../../../shared/Select'
import TextField from '../../../../shared/TextField'
import queryEk from './queryEk'
import storeContext from '../../../../../storeContext'
import ErrorBoundary from '../../../../shared/ErrorBoundary'
import Spinner from '../../../../shared/Spinner'

const FormContainerNoColumnsInner = styled.div`
  padding: 10px;
  padding-bottom: 35px;
`
const EkfrequenzOptionsContainer = styled.div`
  label:hover {
    background: rgba(128, 128, 128, 0.2);
  }
  span {
    font-family: 'Roboto Mono' !important;
    font-size: 14px;
    white-space: pre;
    line-height: 1.5rem;
    font-weight: 500;
  }
`

const Ek = ({ treeName,  saveToDb, row, fieldErrors }) => {
  const store = useContext(storeContext)

  const { activeNodeArray } = store[treeName]

  const apId = activeNodeArray[3]

  const {
    data: dataEk,
    loading: loadingEk,
  } = useQuery(queryEk, {
    variables: {
      id: row?.id || '99999999-9999-9999-9999-999999999999',
      isEk: true,
      apId,
    },
  })

  const ekfrequenzOptions0 = dataEk?.allEkfrequenzs?.nodes ?? []
  const longestAnwendungsfall = max(
    ekfrequenzOptions0.map((a) => (a.anwendungsfall || '').length),
  )
  const ekfrequenzOptions = ekfrequenzOptions0.map((o) => {
    const code = (o.code || '').padEnd(8)
    const anwendungsfall =
      `${(o.anwendungsfall || '').padEnd(longestAnwendungsfall)}` || ''
    return {
      value: o.id,
      label: `${code}: ${anwendungsfall}`,
    }
  })

  if (loadingEk) return <Spinner />

  if (!row) return null

  return (
    <SimpleBar
      style={{
        maxHeight: '100%',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <ErrorBoundary>
        <>
          <FormContainerNoColumnsInner>
            <EkfrequenzOptionsContainer>
              <RadioButtonGroup
                name="ekfrequenz"
                dataSource={ekfrequenzOptions}
                loading={loadingEk}
                label="EK-Frequenz"
                value={row.ekfrequenz}
                saveToDb={saveToDb}
                error={fieldErrors.ekfrequenz}
              />
            </EkfrequenzOptionsContainer>
            <Checkbox2States
              name="ekfrequenzAbweichend"
              label="EK-Frequenz abweichend"
              value={row.ekfrequenzAbweichend}
              saveToDb={saveToDb}
              error={fieldErrors.ekfrequenzAbweichend}
            />
            <TextField
              name="ekfrequenzStartjahr"
              label="Startjahr"
              type="number"
              value={row.ekfrequenzStartjahr}
              saveToDb={saveToDb}
              error={fieldErrors.ekfrequenzStartjahr}
            />
            <Select
              name="ekfKontrolleur"
              label="EKF-KontrolleurIn (nur Adressen mit zugeordnetem Benutzer-Konto)"
              options={dataEk?.allAdresses?.nodes ?? []}
              loading={loadingEk}
              value={row.ekfKontrolleur}
              saveToDb={saveToDb}
              error={fieldErrors.ekfKontrolleur}
            />
          </FormContainerNoColumnsInner>
        </>
      </ErrorBoundary>
    </SimpleBar>
  )
}

export default observer(Ek)
