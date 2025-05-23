import { useCallback, useContext } from 'react'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'

import { MobxContext } from '../../../../mobxContext.js'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const ApDiv = styled.div`
  padding-right: 10px;
`
const EinheitsDiv = styled.div`
  color: ${(props) => (props['data-warn'] ? 'red' : 'unset')};
`
const Label = styled.span`
  color: grey;
  padding-right: 4px;
`
const DelIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`

export const Ap = ({ ap }) => {
  const store = useContext(MobxContext)
  const { removeAp, apsData, apsDataLoading } = store.ekPlan

  const onClickDelete = useCallback(() => removeAp(ap), [ap, removeAp])
  const thisApData = (apsData?.allAps?.nodes ?? []).find(
    (a) => a.id === ap.value,
  )
  const einheits = (thisApData?.ekzaehleinheitsByApId?.nodes ?? []).map(
    (e) => e?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.text,
  )
  const einheitsText =
    einheits.length === 0 ?
      'Keine! Bitte erfassen Sie eine zielrelevante EK-Zähleinheit'
    : einheits.join(', ')
  const labelText =
    einheits.length > 1 ?
      'Zielrelevante Zähleinheiten:'
    : 'Zielrelevante Zähleinheit:'

  return (
    <Container>
      <ApDiv>{`${ap.label}.`}</ApDiv>
      {!apsDataLoading && (
        <>
          <EinheitsDiv data-warn={einheits.length === 0}>
            <Label>{labelText}</Label> {einheitsText}
          </EinheitsDiv>
          <Tooltip title={`${ap.label} entfernen`}>
            <DelIcon
              aria-label={`${ap.label} entfernen`}
              onClick={onClickDelete}
            >
              <FaTimes />
            </DelIcon>
          </Tooltip>
        </>
      )}
    </Container>
  )
}
