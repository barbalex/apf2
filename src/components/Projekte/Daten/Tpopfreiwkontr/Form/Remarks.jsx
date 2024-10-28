import { memo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { TextField2 } from '../../../../shared/TextField2.jsx'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  grid-area: remarks;
`
const RemarksLabel = styled.div`
  font-weight: 700;
  margin-bottom: -10px;
`
const RemarksSubLabel = styled.span`
  padding-left: 5px;
  font-weight: 700;
  font-size: 14px;
  @media print {
    font-size: 11px;
  }
`
const RemarksVal = styled.div`
  > div {
    margin-bottom: -25px;
  }
  textarea {
    @media print {
      font-size: 11px !important;
    }
  }
`

export const Remarks = memo(
  observer(({ saveToDb, row, errors }) => (
    <Container>
      <RemarksLabel>
        Spezielle Bemerkungen
        <RemarksSubLabel>
          (z.B. allgemeiner Eindruck, Zunahme / Abnahme Begründung, spezielle
          Begebenheiten)
        </RemarksSubLabel>
      </RemarksLabel>
      <RemarksVal>
        <TextField2
          key={`${row.id}bemerkungen`}
          name="bemerkungen"
          row={row}
          type="text"
          multiLine
          saveToDb={saveToDb}
          errors={errors}
        />
      </RemarksVal>
    </Container>
  )),
)
