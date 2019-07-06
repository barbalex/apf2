import React, { useCallback, useState, useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'

import Ap from './Ap'
import ChooseAp from './ChooseAp'
import storeContext from '../../../storeContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 0.8rem !important;
  line-height: 1rem !important;
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

const ApList = ({ queryApsResult }) => {
  const store = useContext(storeContext)
  const { aps } = store.ekPlan

  const [showChoose, setShowChoose] = useState(aps.length === 0)
  const onClickAdd = useCallback(() => setShowChoose(true), [])

  return (
    <Container>
      <TitleRow>
        <ApTitle>Aktionspläne</ApTitle>
        {!showChoose && (
          <PlusIcon
            title="Aktionsplan hinzufügen"
            aria-label="Aktionsplan hinzufügen"
            onClick={onClickAdd}
          >
            <FaPlus />
          </PlusIcon>
        )}
      </TitleRow>
      {aps.map(ap => (
        <Ap key={ap.value} ap={ap} queryApsResult={queryApsResult} />
      ))}
      {showChoose && <ChooseAp setShowChoose={setShowChoose} />}
    </Container>
  )
}

export default ApList
