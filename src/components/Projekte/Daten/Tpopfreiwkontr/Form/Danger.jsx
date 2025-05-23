import { memo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { TextField2 } from '../../../../shared/TextField2.jsx'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  grid-area: danger;
`
const DangerLabel = styled.div`
  font-weight: 700;
  margin-bottom: -10px;
`
const DangerSubLabel = styled.span`
  padding-left: 5px;
  font-weight: 700;
  font-size: 14px;
  @media print {
    font-size: 11px;
  }
`
const DangerVal = styled.div`
  > div {
    margin-bottom: -25px;
  }
  textarea {
    @media print {
      font-size: 11px !important;
    }
  }
`

export const Danger = memo(
  observer(({ saveToDb, row, errors }) => (
    <Container>
      <DangerLabel>
        Gefährdung{' '}
        <DangerSubLabel>
          (Problemarten, Verbuschung, Tritt, Hunde, ...), welche?
        </DangerSubLabel>
      </DangerLabel>
      <DangerVal>
        <TextField2
          key={`${row.id}gefaehrdung`}
          name="gefaehrdung"
          row={row}
          type="text"
          multiLine
          saveToDb={saveToDb}
          errors={errors}
        />
      </DangerVal>
    </Container>
  )),
)
