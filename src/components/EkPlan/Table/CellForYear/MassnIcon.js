import React, { useContext } from 'react'
import styled from '@emotion/styled'
import sum from 'lodash/sum'
import { GoZap } from 'react-icons/go'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'

const CheckboxContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: ${(props) => (props.showcount ? 'space-between' : 'center')};
`
const MassnContainer = styled.div`
  position: relative;
  width: 17px;
  height: 17px;
  flex-grow: 0;
  flex-basis: 19px;
  flex-shrink: 0;
`
const MassnSymbol = styled(GoZap)`
  font-size: 1.1rem;
  color: #2e7d32;
`
const NrOfMassn = styled.div`
  font-weight: 700;
  font-size: smaller;
  position: absolute;
  bottom: -2px;
  right: 0;
  color: red;
`
const SumCounted = styled.div`
  margin-left: 3px;
  flex-grow: 0;
  flex-basis: 32px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const MassnIcon = ({ ansiedlungs }) => {
  const store = useContext(storeContext)
  const { showCount, showEkCount } = store.ekPlan

  if (!ansiedlungs.length) {
    return <CheckboxContainer>&nbsp;</CheckboxContainer>
  }
  let sumCounted = null
  const ansiedlungsWithCount = ansiedlungs.filter(
    (ans) => ans.zieleinheitAnzahl !== null,
  )
  if (ansiedlungsWithCount.length) {
    sumCounted = sum(ansiedlungsWithCount.map((ans) => ans.zieleinheitAnzahl))
  }

  return (
    <CheckboxContainer showcount={showCount}>
      <MassnContainer>
        <MassnSymbol />
        {showEkCount && ansiedlungs.length > 1 && (
          <NrOfMassn>{ansiedlungs.length}</NrOfMassn>
        )}
      </MassnContainer>
      {showCount && (
        <SumCounted>{sumCounted !== null ? sumCounted : ' '}</SumCounted>
      )}
    </CheckboxContainer>
  )
}

export default observer(MassnIcon)
