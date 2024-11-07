import { memo } from 'react'
import styled from '@emotion/styled'

import { ApErfolg } from './ApErfolg/index.jsx'
import { PopStatus } from './PopStatus/index.jsx'
import { PopMenge } from './PopMenge/index.jsx'
import { TpopKontrolliert } from './TpopKontrolliert/index.jsx'

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
  padding-top: 0;
`

export const Component = memo(() => (
  <FormContainer>
    <ApErfolg />
    <PopStatus />
    <PopMenge />
    <TpopKontrolliert />
  </FormContainer>
))
