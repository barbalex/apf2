import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sum from 'lodash/sum'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'

const CheckboxContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: ${(props) => (props.showcount ? 'space-between' : 'center')};
`

const Icon = styled.svg`
  fill: none;
  stroke: #2e7d32;
  stroke-width: 3px;
`
const StyledCheckbox = styled.div`
  position: relative;
  width: 17px;
  height: 17px;
  background: ${(props) =>
    props.planned ? 'rgba(46, 125, 50, 0.05)' : 'none'};
  border-radius: 3px;
  border: ${(props) => (props.planned ? '1px solid #2e7d32' : 'none')};
  transition: all 150ms;
  flex-grow: 0;
  flex-basis: 19px;
  flex-shrink: 0;
`
const NrOfEk = styled.div`
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

const EkIcon = ({ planned, eks, einheits }) => {
  const store = useContext(storeContext)
  const { showCount, showEkCount } = store.ekPlan

  //console.log('EkIcon', { planned, eks, einheits })

  if (!planned && !eks.length) {
    return <CheckboxContainer>&nbsp;</CheckboxContainer>
  }
  let sumCounted = null
  let eksHaveCountedZielrelevanteEinheits = false
  if (einheits && einheits.length) {
    eksHaveCountedZielrelevanteEinheits =
      eks
        .flatMap((ek) =>
          get(ek, 'tpopkontrzaehlsByTpopkontrId.nodes', []).filter(
            (z) =>
              einheits.includes(z.einheit) &&
              z.anzahl !== null &&
              get(
                z,
                'tpopkontrzaehlEinheitWerteByEinheit.ekzaehleinheitsByZaehleinheitId.nodes',
                [],
              ).length > 0,
          ),
        )
        .filter((o) => !!o).length > 0
  }
  if (eksHaveCountedZielrelevanteEinheits) {
    sumCounted = sum(
      eks.flatMap((ek) =>
        get(ek, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
          .filter(
            (z) =>
              einheits.includes(z.einheit) &&
              z.anzahl !== null &&
              get(
                z,
                'tpopkontrzaehlEinheitWerteByEinheit.ekzaehleinheitsByZaehleinheitId.nodes',
                [],
              ).length > 0,
          )
          .flatMap((z) => z.anzahl),
      ),
    )
  }

  return (
    <CheckboxContainer showcount={showCount}>
      <StyledCheckbox planned={planned}>
        {!!eks.length && (
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        )}
        {showEkCount && eks.length > 1 && <NrOfEk>{eks.length}</NrOfEk>}
      </StyledCheckbox>
      {showCount && (
        <SumCounted>{sumCounted !== null ? sumCounted : ' '}</SumCounted>
      )}
    </CheckboxContainer>
  )
}

export default observer(EkIcon)
