// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { Query } from 'react-apollo'

import dataGql from './data.graphql'

const Container = styled.div`
  padding: 0.2cm 0;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const Year = styled.div`
  position: relative;
  left: 10cm;
  width: 2cm;
  text-align: center;
`
const Label1 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
`
const Number = styled.div`
  min-width: 1cm;
  max-width: 1cm;
`
const PopBerJahr = styled(Number)``
const TpopBerJahr = styled(Number)`
  padding-right: 1cm;
`
const PopSeit = styled(Number)``
const TpopSeit = styled(Number)``

const AMengen = ({
  apId,
  jahr,
}:{
  apId: String,
  jahr: Number,
}) =>
  <Query
    query={dataGql}
    variables={{ apId }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const oneLPop = get(data, 'apById.oneLPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
        .length

      return (
        <Container>
          <Row>
            <Year>{jahr}</Year>
          </Row>
          <Row>
            <Label1>Anzahl bekannt</Label1>
            <PopBerJahr>{oneLPop}</PopBerJahr>
            <TpopBerJahr>
            </TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
        </Container>
      )
    }}
  </Query>
  

export default AMengen
