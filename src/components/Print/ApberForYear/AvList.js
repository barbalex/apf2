// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from '../../shared/ErrorBoundary'

const Row = styled.div`
  display: flex;
  padding: 0.2cm 0;
`

const AvList = ({
  data,
}:{
  data: Object,
}) => {
  const avGrouped = groupBy(
    sortBy(
      get(data, 'projektById.apsByProjId.nodes', []).map(ap => ({
        v: get(ap, 'adresseByBearbeiter.name', '(kein Wert)'),
        art: get(ap, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)')
      })),
      'v'
    ),
    'v'
  )
  console.log('avGrouped:',avGrouped)

  return (
    <ErrorBoundary>
      {
        Object.keys(avGrouped).map(av => <Row>{av}</Row>)
      }
    </ErrorBoundary>
  )
}

export default AvList
