import React, { useCallback } from 'react'
import Typography from '@mui/material/Typography'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import { StaticImage } from 'gatsby-plugin-image'
import Button from '@mui/material/Button'

import Layout from '../components/Layout'
import ErrorBoundary from '../components/shared/ErrorBoundary'

const Container = styled.div`
  height: calc(100% - 64px);
`
const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700 !important;
  text-shadow: 2px 2px 3px white, -2px -2px 3px white, 2px -2px 3px white,
    -2px 2px 3px white;
`
const PageTitle = styled(Typography)`
  font-size: 2em !important;
  padding: 15px;
  font-weight: 700 !important;
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

const bgImageStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
}

const FourOFour = () => {
  const onClickBack = useCallback(() => navigate('/'), [])

  return (
    <ErrorBoundary>
      <Container>
        <Layout>
          <div>
            <StaticImage
              style={bgImageStyle}
              src="../images/ophr-ara.jpg"
              alt="Ophrys"
              layout="fullWidth"
            />
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
          </div>
        </Layout>
      </Container>
    </ErrorBoundary>
  )
}

export default FourOFour
