import { memo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { FilesRouter } from '../../../../shared/Files/index.jsx'

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

export const Files = memo(
  observer(({ row }) => (
    <Container>
      <RemarksLabel>Dateien</RemarksLabel>
      <RemarksVal>
        <FilesRouter
          parentId={row.id}
          parent="tpopkontr"
        />
      </RemarksVal>
    </Container>
  )),
)
