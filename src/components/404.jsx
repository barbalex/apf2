import React, { useCallback } from 'react'
import Typography from '@mui/material/Typography'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { useNavigate, useLocation } from 'react-router-dom'

const Img = styled.img`
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
`
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
  scrollbar-width: thin;
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
  text-shadow:
    2px 2px 3px white,
    -2px -2px 3px white,
    2px -2px 3px white,
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
  text-shadow:
    2px 2px 3px white,
    -2px -2px 3px white,
    2px -2px 3px white,
    -2px 2px 3px white;
`
const Text = styled(Typography)`
  font-size: 1.5em !important;
  padding: 15px;
  font-weight: 700 !important;
`
const StyledButton = styled(Button)`
  text-shadow:
    2px 2px 3px white,
    -2px -2px 3px white,
    2px -2px 3px white,
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
      <picture>
        <source
          srcSet="home_700.avif 700w, home_1000.avif 1000w, home_1400.avif 1400w, home_2000.avif 2000w, home_2500.avif 2500w"
          type="image/avif"
        />
        <Img
          src="home_700.webp"
          srcSet="home_700.webp 700w, home_1000.webp 1000w, home_1400.webp 1400w, home_2000.webp 2000w, home_2500.webp 2500w"
          sizes="100vw"
          alt="Spinnen-Ragwurz"
        />
      </picture>
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

export const Component = FourOhFour
