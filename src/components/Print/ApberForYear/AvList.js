// @flow
import React, { Fragment } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from '../../shared/ErrorBoundary'

const AvRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const NonAvRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
`
const Av = styled.div`
  min-width: 7cm;
  max-width: 7cm;
`
const Art = styled.div``

const AvList = ({
  data,
}:{
  data: Object,
}) => {
  const avGrouped = groupBy(
    sortBy(
      get(data, 'projektById.apsByProjId.nodes', []).map(ap => ({
        av: get(ap, 'adresseByBearbeiter.name', '(kein Wert)'),
        art: get(ap, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)')
      })),
      'av'
    ),
    'av'
  )
  console.log('avGrouped:',avGrouped)

  return (
    <ErrorBoundary>
      {
        Object.keys(avGrouped).map(av =>
          <Fragment key={av}>
            <AvRow>
              <Av>{avGrouped[av].av}</Av>
              <Art>{avGrouped[av].art}</Art>
            </AvRow>
          </Fragment>
        )
      }
    </ErrorBoundary>
  )
}

export default AvList
