// @flow
import React from 'react'
import { FixedSizeList as List } from 'react-window'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import styled from 'styled-components'

const OuterContainer = styled.div`
  border-bottom: 1px solid;
`
const InnerContainer = styled.div`
  height: 81px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const EkfList = ({
  data,
  dimensions,
}: {
  data: Object,
  dimensions: Object,
}) => {
  const ekf = get(
    data,
    'userByName.adresseByAdresseId.tpopkontrsByBearbeiter.nodes',
    []
  ).map(e => ({
    projekt: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.projektByProjId.name',
      ''
    ),
    art: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
      ''
    ),
    pop: `${get(e, 'tpopByTpopId.popByPopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.popByPopId.name',
      '(kein Name)'
    )}`,
    tpop: `${get(e, 'tpopByTpopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.flurname',
      '(kein Flurname)'
    )}`,
  }))
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const width = isNaN(dimensions.width) ? 250 : dimensions.width
  const projektCount = uniq(ekf.map(e => e.projekt)).length

  return (
    <List height={height} itemCount={ekf.length} itemSize={110} width={width}>
      {({ index, style }) => {
        const row = ekf[index]

        return (
          <OuterContainer style={style}>
            <InnerContainer>
              {projektCount > 1 && <div>{row.projekt}</div>}
              <div>{row.art}</div>
              <div>{row.pop}</div>
              <div>{row.tpop}</div>
            </InnerContainer>
          </OuterContainer>
        )
      }}
    </List>
  )
}

export default EkfList
