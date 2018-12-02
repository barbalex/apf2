// @flow
import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import compose from 'recompose/compose'

import initiateDataFromUrl from '../initiateDataFromUrl'
import mobxStoreContext from '../../../../mobxStoreContext'

const OuterContainer = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${props => (props.active ? 'rgb(255, 250, 198)' : 'unset')};
  border-top: ${props =>
    props.active ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`
const InnerContainer = styled.div`
  height: ${props => props.height}px;
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

const enhance = compose(observer)

const EkfList = ({
  activeTpopkontrId,
  projektCount,
  style,
  row,
}: {
  activeTpopkontrId: string,
  projektCount: number,
  style: Object,
  row: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const innerContainerHeight = projektCount > 1 ? 81 : 62
  const url = [
    'Projekte',
    row.projId,
    'Aktionspläne',
    row.apId,
    'Populationen',
    row.popId,
    'Teil-Populationen',
    row.tpopId,
    'Freiwilligen-Kontrollen',
    row.id,
  ]

  const onClick = useCallback(
    () =>
      initiateDataFromUrl({
        activeNodeArray: url,
        mobxStore,
      }),
    [row.id],
  )

  return (
    <OuterContainer
      style={style}
      onClick={onClick}
      active={activeTpopkontrId === row.id}
    >
      <InnerContainer height={innerContainerHeight}>
        {projektCount > 1 && <div>{row.projekt}</div>}
        <div>{row.art}</div>
        <div>{row.pop}</div>
        <div>{row.tpop}</div>
      </InnerContainer>
    </OuterContainer>
  )
}

export default enhance(EkfList)
