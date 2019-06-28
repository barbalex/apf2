import React, { useState, useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'

import queryApsToChoose from './queryApsToChoose'
import storeContext from '../../storeContext'

const Container = styled.div`
  height: calc(100vh - 64px);
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

const EkPlan = () => {
  const store = useContext(storeContext)

  const { activeNodeArray } = store.tree

  const [aps, setAps] = useState(['6c52d174-4f62-11e7-aebe-67a303eb0640'])
  const projId = activeNodeArray[1] || '99999999-9999-9999-9999-999999999999'

  const {
    data: dataApsToChoose,
    loading: loadingApsToChoose,
    error: errorApsToChoose,
  } = useQuery(queryApsToChoose, {
    variables: {
      aps,
      projId,
    },
  })

  const apsToChoose = get(dataApsToChoose, 'allAps.nodes', [])
  console.log('EkPlan', {
    dataApsToChoose,
    apsToChoose,
    projId,
    aps,
    errorApsToChoose,
    loadingApsToChoose,
  })

  return (
    <ErrorBoundary>
      <Container>
        <div>Hier ist was im Aufbau</div>
        <StyledTable size="small">
          <TableHead>
            <TableRow>
              <TableCell>Jahr</TableCell>
              <TableCell>geplant</TableCell>
              <TableCell>ausgeführt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aps.length === 0 ? (
              <TableRow>
                <TableCell>Bitte AP wählen</TableCell>
              </TableRow>
            ) : loadingEk ? (
              <TableRow>
                <TableCell>Lade...</TableCell>
              </TableRow>
            ) : errorEk ? (
              <TableRow>
                <TableCell>errorEk.message</TableCell>
              </TableRow>
            ) : (
              Object.keys(ekGroupedByYear)
                .reverse()
                .map(year => <EkYear key={year} data={ekGroupedByYear[year]} />)
            )}
          </TableBody>
        </StyledTable>
      </Container>
    </ErrorBoundary>
  )
}

export default EkPlan
