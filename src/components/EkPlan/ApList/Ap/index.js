import React, { useCallback, useContext } from 'react'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import get from 'lodash/get'

import storeContext from '../../../../storeContext'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const ApDiv = styled.div`
  padding-right: 10px;
`
const EinheitsDiv = styled.div`
  color: ${props => (props['data-warn'] ? 'red' : 'unset')};
`
const Label = styled.span`
  color: grey;
  padding-right: 4px;
`
const DelIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
`

const Ap = ({ ap, queryApsResult }) => {
  const store = useContext(storeContext)
  const { removeAp } = store.ekPlan

  const onClickDelete = useCallback(() => removeAp(ap), [ap])
  const { data, loading } = queryApsResult
  const thisApData = get(data, 'allAps.nodes', []).find(a => a.id === ap.value)
  const einheits = get(thisApData, 'ekzaehleinheitsByApId.nodes', []).map(e =>
    get(e, 'tpopkontrzaehlEinheitWerteByZaehleinheitId.text'),
  )
  const einheitsText =
    einheits.length === 0
      ? 'Keine! Bitte erfassen Sie eine zielrelevante EK-Zähleinheit'
      : einheits.join(', ')
  const labelText =
    einheits.length > 1
      ? 'Zielrelevante Zähleinheiten:'
      : 'Zielrelevante Zähleinheit:'

  return (
    <Container>
      <ApDiv>{`${ap.label}.`}</ApDiv>
      {!loading && (
        <EinheitsDiv data-warn={einheits.length === 0}>
          <Label>{labelText}</Label> {einheitsText}
        </EinheitsDiv>
      )}
      <DelIcon
        title={`${ap.label} entfernen`}
        aria-label={`${ap.label} entfernen`}
        onClick={onClickDelete}
      >
        <FaTimes />
      </DelIcon>
    </Container>
  )
}

export default Ap
