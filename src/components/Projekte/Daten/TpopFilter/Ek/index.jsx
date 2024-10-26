import styled from '@emotion/styled'
import max from 'lodash/max'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'

import Checkbox2States from '../../../../shared/Checkbox2States.jsx'
import RadioButtonGroup from '../../../../shared/RadioButtonGroup.jsx'
import Select from '../../../../shared/Select.jsx'
import TextField from '../../../../shared/TextField.jsx'
import queryEk from './queryEk.js'
import ErrorBoundary from '../../../../shared/ErrorBoundary.jsx'
import Spinner from '../../../../shared/Spinner.jsx'

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

const Ek = ({ saveToDb, row, fieldErrors }) => {
  const { apId } = useParams()

  const { data: dataEk, loading: loadingEk } = useQuery(queryEk, {
    variables: {
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
      tabIndex={-1}
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

export default Ek
