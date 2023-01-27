import React from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import Files from '../../../shared/Files'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  grid-area: files;
`
const RemarksLabel = styled.div`
  font-weight: 700;
  margin-bottom: 10px;
`
const RemarksVal = styled.div`
  margin-bottom: -10px;
`

const EkfFiles = ({ row }) => (
  <Container>
    <RemarksLabel>Dateien</RemarksLabel>
    <RemarksVal>
      <Files parentId={row.id} parent="tpopkontr" />
    </RemarksVal>
  </Container>
)

export default observer(EkfFiles)
