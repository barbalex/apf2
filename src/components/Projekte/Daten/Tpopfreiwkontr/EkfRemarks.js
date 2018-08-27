// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import TextField from '../../../shared/TextField'

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
    margin-bottom: -15px;
  }
  > div > div > div > textarea {
    @media print {
      font-size: 11px !important;
    }
  }
`

const EkfRemarks = ({
  saveToDb,
  errors,
  data,
  updateTpopkontr,
}: {
  saveToDb: () => void,
  errors: Object,
  data: Object,
  updateTpopkontr: () => void,
}) => {
  const row = get(data, 'tpopkontrById', {})

  return (
    <Container>
      <RemarksLabel>
        Bemerkungen über diese Kontrolle
        <RemarksSubLabel>(nicht Teil der Datenerfassung)</RemarksSubLabel>
      </RemarksLabel>
      <RemarksVal>
        <TextField
          key={`${row.id}ekfBemerkungen`}
          value={row.ekfBemerkungen}
          type="text"
          multiLine
          saveToDb={value =>
            saveToDb({
              row,
              field: 'ekfBemerkungen',
              value,
              updateTpopkontr,
            })
          }
          error={errors.ekfBemerkungen}
        />
      </RemarksVal>
    </Container>
  )
}

export default EkfRemarks
