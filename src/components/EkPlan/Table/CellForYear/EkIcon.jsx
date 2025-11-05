import { useContext } from 'react'
import styled from '@emotion/styled'
import { sum } from 'es-toolkit'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
`

const Icon = styled.svg`
  fill: none;
  stroke: #2e7d32;
  stroke-width: 3px;
`
const Checkbox = styled.div`
  position: relative;
  width: 17px;
  height: 17px;
  border-radius: 3px;
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
  align-self: center;
  flex-grow: 0;
  flex-basis: 32px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const EkIcon = observer(({ planned, eks, einheits }) => {
  const store = useContext(MobxContext)
  const { showCount, showEkCount } = store.ekPlan

  //console.log('EkIcon', { planned, eks, einheits })

  const containerStyle = {
    justifyContent: showCount ? 'space-between' : 'center',
  }

  if (!planned && !eks.length) {
    return <Container>&nbsp;</Container>
  }
  let sumCounted = null
  let eksHaveCountedZielrelevanteEinheits = false
  if (einheits && einheits.length) {
    eksHaveCountedZielrelevanteEinheits =
      eks
        .flatMap((ek) =>
          (ek?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []).filter(
            (z) =>
              einheits.includes(z.einheit) &&
              z.anzahl !== null &&
              z?.tpopkontrzaehlEinheitWerteByEinheit
                ?.ekzaehleinheitsByZaehleinheitId?.totalCount > 0,
          ),
        )
        .filter((o) => !!o).length > 0
  }
  if (eksHaveCountedZielrelevanteEinheits) {
    sumCounted = sum(
      eks.flatMap((ek) =>
        (ek?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
          .filter(
            (z) =>
              einheits.includes(z.einheit) &&
              z.anzahl !== null &&
              z?.tpopkontrzaehlEinheitWerteByEinheit
                ?.ekzaehleinheitsByZaehleinheitId?.totalCount > 0,
          )
          .flatMap((z) => z.anzahl),
      ),
    )
  }

  return (
    <Container style={containerStyle}>
      <Checkbox
        style={{
          background: planned ? 'rgba(46, 125, 50, 0.05)' : 'none',
          border: planned ? '1px solid #2e7d32' : 'none',
        }}
      >
        {!!eks.length && (
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        )}
        {showEkCount && eks.length > 1 && <NrOfEk>{eks.length}</NrOfEk>}
      </Checkbox>
      {showCount && (
        <SumCounted>{sumCounted !== null ? sumCounted : ' '}</SumCounted>
      )}
    </Container>
  )
})
