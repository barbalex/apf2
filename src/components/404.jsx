import React, { useCallback } from 'react'
import Typography from '@mui/material/Typography'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { useNavigate, useLocation } from 'react-router-dom'

import ProgressiveImg from './shared/ProgressiveImg'
import image from '../images/ophr-ara.jpg'
// TODO: build small version of image
import placeholderSrc from '../images/ophr-ara.jpg'

const OuterContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
`
const InnerContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  overflow-y: auto;
  /* prevent layout shift when scrollbar appears */
  scrollbar-gutter: stable;
  color: black !important;
`
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  position: relative;
  @media (min-width: 700px) {
    padding: 20px;
  }
  @media (min-width: 1200px) {
    padding: 25px;
  }
  @media (min-width: 1700px) {
    padding: 25px;
  }
  p {
    margin-bottom: 10px !important;
  }
  p:last-of-type {
    margin-bottom: 0 !important;
    margin-top: 10px !important;
  }
`
const PageTitle = styled(Typography)`
  font-size: 2em !important;
  padding-top: 15px;
  padding-bottom: 0;
  font-weight: 700 !important;
  text-shadow: 2px 2px 3px white, -2px -2px 3px white, 2px -2px 3px white,
    -2px 2px 3px white;
  @media (min-width: 700px) {
    padding-top: 20px;
    padding-bottom: 5;
  }
  @media (min-width: 1200px) {
    padding-top: 25px;
    padding-bottom: 10px;
  }
  @media (min-width: 1700px) {
    padding-top: 30px;
    padding-bottom: 15px;
  }
`
const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700 !important;
  text-shadow: 2px 2px 3px white, -2px -2px 3px white, 2px -2px 3px white,
    -2px 2px 3px white;
`
const Text = styled(Typography)`
  font-size: 1.5em !important;
  padding: 15px;
  font-weight: 700 !important;
`
const StyledButton = styled(Button)`
  text-shadow: 2px 2px 3px white, -2px -2px 3px white, 2px -2px 3px white,
    -2px 2px 3px white;
  border-color: white !important;
  margin-top: 10px !important;
`

const FourOhFour = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const onClickBack = useCallback(
    () => navigate(`/${search}`),
    [navigate, search],
  )

  return (
    <OuterContainer>
      <ProgressiveImg src={image} placeholderSrc={placeholderSrc} />
      <InnerContainer>
        <PageTitle align="center" variant="h6" color="inherit">
          Bedrohte Pflanzenarten fördern
        </PageTitle>
        <CardContainer>
          <TextContainer>
            <PageTitle align="center" variant="h6">
              Oh je
            </PageTitle>
          </TextContainer>
          <TextContainer>
            <Text align="center" variant="h6">
              Diese Seite ist nicht verfügbar.
            </Text>
          </TextContainer>
          <TextContainer>
            <StyledButton
              variant="outlined"
              onClick={onClickBack}
              color="inherit"
            >
              Zurück zur Startseite
            </StyledButton>
          </TextContainer>
        </CardContainer>
      </InnerContainer>
    </OuterContainer>
  )
}

export default FourOhFour
