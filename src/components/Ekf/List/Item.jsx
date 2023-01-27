import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const OuterContainer = styled.div`
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? 'rgb(255, 250, 198)' : 'unset'};
  outline: 1px solid rgba(46, 125, 50, 0.5);
  height: ${(props) => props.height}px;
  &:hover {
    background-color: rgb(255, 250, 198);
    /* outline: 2px solid rgba(46, 125, 50, 0.5); */
  }
  &:last-of-type {
    border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  }
`
const InnerContainer = styled.div`
  height: ${(props) => props.height}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  box-sizing: border-box;
  > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const EkfList = ({ projektCount, style, row }) => {
  const { search } = useLocation()
  const { ekfId, userId, ekfYear } = useParams()
  const navigate = useNavigate()
  const innerContainerHeight = projektCount > 1 ? 110 : 91

  const onClick = useCallback(
    () =>
      navigate(`/Daten/Benutzer/${userId}/EKF/${ekfYear}/${row.id}${search}`),
    [ekfYear, navigate, row.id, search, userId],
  )

  return (
    <OuterContainer
      style={style}
      onClick={onClick}
      active={ekfId === row.id}
      height={innerContainerHeight}
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

export default EkfList
