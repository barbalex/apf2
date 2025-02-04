import { useCallback, useState, useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'

import { Ap } from './Ap/index.jsx'
import { ChooseAp } from './ChooseAp/index.jsx'
import { MobxContext } from '../../../mobxContext.js'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 0.8rem !important;
  line-height: 1rem !important;
  padding-bottom: 5px;
`
const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`
const ApTitle = styled.h4`
  margin: 4px 0;
`
const PlusIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
`

export const ApList = () => {
  const store = useContext(MobxContext)
  const { aps } = store.ekPlan

  const [showChoose, setShowChoose] = useState(aps.length === 0)
  const onClickAdd = useCallback(() => setShowChoose(true), [])

  return (
    <Container>
      <TitleRow>
        <ApTitle>Arten</ApTitle>
        {!showChoose && (
          <Tooltip title="Art hinzufügen">
            <PlusIcon
              aria-label="Art hinzufügen"
              onClick={onClickAdd}
            >
              <FaPlus />
            </PlusIcon>
          </Tooltip>
        )}
      </TitleRow>
      {aps.map((ap) => (
        <Ap
          key={ap.value}
          ap={ap}
        />
      ))}
      {(aps.length === 0 || showChoose) && (
        <ChooseAp setShowChoose={setShowChoose} />
      )}
    </Container>
  )
}
