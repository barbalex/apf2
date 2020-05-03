import React, { useContext } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'
import get from 'lodash/get'
import max from 'lodash/max'
import groupBy from 'lodash/groupBy'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'

import Checkbox2States from '../../../../shared/Checkbox2StatesFormik'
import RadioButtonGroup from '../../../../shared/RadioButtonGroupFormik'
import Select from '../../../../shared/SelectFormik'
import TextField from '../../../../shared/TextFieldFormik'
import queryEk from './queryEk'
import queryEkfrequenzs from './queryEkfrequenzs'
import queryAdresses from './queryAdresses'
import storeContext from '../../../../../storeContext'
import EkYear from './EkYear'
import ErrorBoundary from '../../../../shared/ErrorBoundary'

const FormContainerNoColumns = styled.div`
  overflow-y: auto !important;
  height: calc(100% - 20px);
`
const FormContainerNoColumnsInner = styled.div`
  padding: 10px;
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
const StyledTable = styled(Table)`
  padding-left: 10px;
  padding-right: 10px;
  thead {
    background: rgba(128, 128, 128, 0.2);
  }
  thead tr th {
    font-size: 0.875rem;
    color: black;
  }
  tbody tr:nth-of-type(even) {
    background: rgba(128, 128, 128, 0.05);
  }
  th:first-child,
  td:first-child {
    padding-left: 10px;
  }
`
const EkplanTitle = styled.h5`
  margin-top: -30px;
  margin-left: 10px;
  margin-bottom: 10px;
`

const Tpop = ({ treeName, showFilter, onSubmit, row }) => {
  const store = useContext(storeContext)

  const { activeNodeArray } = store[treeName]

  const apId = activeNodeArray[3]

  const { data: dataEk, loading: loadingEk, error: errorEk } = useQuery(
    queryEk,
    {
      variables: {
        id: row.id || '99999999-9999-9999-9999-999999999999',
        isEk: true,
      },
    },
  )

  const { data: dataEkfrequenzs, loading: loadingEkfrequenzs } = useQuery(
    queryEkfrequenzs,
    {
      variables: {
        apId,
      },
    },
  )

  const { data: dataAdresses, loading: loadingAdresses } = useQuery(
    queryAdresses,
  )

  const ekfrequenzOptions0 = get(dataEkfrequenzs, 'allEkfrequenzs.nodes', [])
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

  const ekGroupedByYear = groupBy(
    [
      ...get(dataEk, 'allTpopkontrs.nodes', [])
        .filter((e) => e.jahr !== null)
        .map((t) => ({ ...t, is: 'ek' })),
      ...get(dataEk, 'allEkplans.nodes', [])
        .filter((e) => e.jahr !== null)
        .map((t) => ({ ...t, is: 'ekplan' })),
    ],
    'jahr',
  )

  return (
    <ErrorBoundary>
      <>
        <FormContainerNoColumns>
          <Formik
            key={showFilter ? row : row.id}
            initialValues={row}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ handleSubmit, handleChange, handleBlur, dirty, setErrors }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <FormContainerNoColumnsInner>
                  <EkfrequenzOptionsContainer>
                    <Field
                      name="ekfrequenz"
                      dataSource={ekfrequenzOptions}
                      loading={loadingEkfrequenzs}
                      label="EK-Frequenz"
                      component={RadioButtonGroup}
                    />
                  </EkfrequenzOptionsContainer>
                  <Field
                    name="ekfrequenzAbweichend"
                    label="EK-Frequenz abweichend"
                    component={Checkbox2States}
                  />
                  <Field
                    name="ekfrequenzStartjahr"
                    label="Startjahr"
                    type="number"
                    component={TextField}
                  />
                  <Field
                    name="ekfKontrolleur"
                    label="EKF-KontrolleurIn (nur Adressen mit zugeordnetem Benutzer-Konto)"
                    component={Select}
                    options={get(dataAdresses, 'allAdresses.nodes', [])}
                    loading={loadingAdresses}
                  />
                </FormContainerNoColumnsInner>
              </Form>
            )}
          </Formik>
          {!showFilter && (
            <>
              <EkplanTitle>EK-Plan</EkplanTitle>
              <StyledTable size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Jahr</TableCell>
                    <TableCell>geplant</TableCell>
                    <TableCell>ausgeführt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingEk ? (
                    <TableRow>
                      <TableCell>Lade...</TableCell>
                    </TableRow>
                  ) : errorEk ? (
                    <TableRow>
                      <TableCell>{errorEk.message}</TableCell>
                    </TableRow>
                  ) : (
                    Object.keys(ekGroupedByYear)
                      .reverse()
                      .map((year) => (
                        <EkYear key={year} data={ekGroupedByYear[year]} />
                      ))
                  )}
                </TableBody>
              </StyledTable>
            </>
          )}
        </FormContainerNoColumns>
      </>
    </ErrorBoundary>
  )
}

export default observer(Tpop)
