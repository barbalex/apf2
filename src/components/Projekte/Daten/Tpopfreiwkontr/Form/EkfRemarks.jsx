import styled from '@emotion/styled'

import { TextField2 } from '../../../../shared/TextField2.jsx'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  grid-area: ekfRemarks;
`
const RemarksLabel = styled.div`
  font-weight: 700;
  margin-bottom: -10px;
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

export const EkfRemarks = ({ saveToDb, row, errors }) => (
  <Container>
    <RemarksLabel>Mitteilungen zwischen AV/Topos und Freiwilligen</RemarksLabel>
    <RemarksVal>
      <TextField2
        key={`${row.id}ekfBemerkungen`}
        name="ekfBemerkungen"
        row={row}
        type="text"
        multiLine
        saveToDb={saveToDb}
        errors={errors}
      />
    </RemarksVal>
  </Container>
)
