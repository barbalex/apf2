import React from 'react'
import styled from 'styled-components'
import Diff from 'react-stylable-diff'
import { observer } from 'mobx-react-lite'

import toStringIfPossible from '../../../modules/toStringIfPossible'
import Spinner from '../Spinner'

const Row = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: ${(props) =>
    props['data-last'] ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
  .Difference > del {
    background-color: rgb(201, 238, 211);
    text-decoration: none;
  }
  .Difference > ins {
    padding-left: 2px;
    background-color: rgba(216, 67, 21, 0.2);
    text-decoration: none;
  }
`
const Key = styled.div`
  width: 225px;
  padding-right: 5px;
  color: rgba(0, 0, 0, 0.54);
`

const ConflictData = ({ dataArray = [], loading }) => {
  if (loading) return <Spinner />

  return dataArray.map((d, index) => {
    // need to use get to enable passing paths as key, for instance 'person.name'
    // also stringify because Diff split's it
    let inputA = toStringIfPossible(d.valueInRow)
    let inputB = toStringIfPossible(d.valueInHist)
    // explicitly show when only one of the values is empty
    if (inputA !== inputB) {
      inputA = inputA ?? '(nichts)'
      inputB = inputB ?? '(nichts)'
    }

    const showDiff = !['geändert', 'geändert von'].includes(d.label)

    return (
      <Row key={d.label} data-last={index + 1 === dataArray.length}>
        <Key>{`${d.label}:`}</Key>
        {showDiff ? (
          <Diff inputA={inputA} inputB={inputB} type="sentences" />
        ) : (
          <div>{inputB}</div>
        )}
      </Row>
    )
  })
}

export default observer(ConflictData)
