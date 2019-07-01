import React, { useCallback } from 'react'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`
const ApDiv = styled.div`
  min-width: 200px;
  flex-grow: 1;
`
const DelIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
`

const Ap = ({ ap, removeAp }) => {
  const onClickDelete = useCallback(() => {
    removeAp(ap)
  }, [ap])

  return (
    <Container>
      <ApDiv>{ap.label}</ApDiv>
      <DelIcon
        title={`${ap.label} entfernen`}
        aria-label={`${ap.label} entfernen`}
        onClick={onClickDelete}
      >
        <FaTimes />
      </DelIcon>
    </Container>
  )
}

export default Ap
