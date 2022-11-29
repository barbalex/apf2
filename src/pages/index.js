import React from 'react'
import Typography from '@mui/material/Typography'
import MaterialCard from '@mui/material/Card'
import styled from '@emotion/styled'
import { StaticImage } from 'gatsby-plugin-image'
import SimpleBar from 'simplebar-react'

import Layout from '../components/Layout'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import Header from '../components/Head'

const OuterContainer = styled.div`
  overflow-y: auto;
  height: ${(props) => `calc(100% - ${props.appbarheight}px)`};
`
const StyledSimpleBar = styled(SimpleBar)`
  max-height: 100%;
  height: 100%;
  .simplebar-content {
    /* without this image did not cover 100% on large screens */
    height: 100%;
  }
  .simplebar-scrollbar:before {
    background: rgba(0, 0, 0, 0.7) !important;
  }
`
const Container = styled.div`
  padding: 15px;
  position: relative;
  min-height: 100%;
  color: black !important;
  @media (min-width: 700px) {
    padding: 20px;
  }
  @media (min-width: 1200px) {
    padding: 25px;
  }
  @media (min-width: 1700px) {
    padding: 25px;
  }
`
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 30px;
    grid-row-gap: 30px;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 40px;
    grid-row-gap: 60px;
  }
  @media (min-width: 1700px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 65px;
    grid-row-gap: 90px;
  }
  p {
    margin-bottom: 10px !important;
  }
  p:last-of-type {
    margin-bottom: 0 !important;
    margin-top: 10px !important;
  }
`
const Card = styled(MaterialCard)`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.55) !important;
  font-weight: 500;
  /*text-shadow: 1px 1px 2px white, -0px -0px 2px white, 1px -0px 2px white,
    -0px 1px 2px white;*/
  ul {
    margin-bottom: 0;
  }
  li:last-of-type {
    margin-bottom: 0;
  }
  li {
    font-weight: 500;
  }
`
const PageTitle = styled(Typography)`
  font-size: 2em !important;
  padding-bottom: 15px;
  font-weight: 700 !important;
  text-shadow: 2px 2px 3px white, -2px -2px 3px white, 2px -2px 3px white,
    -2px 2px 3px white;
  @media (min-width: 700px) {
    padding-bottom: 25px;
  }
  @media (min-width: 1200px) {
    padding-top: 10px;
    padding-bottom: 40px;
  }
  @media (min-width: 1700px) {
    padding-top: 20px;
    padding-bottom: 50px;
  }
`
const CardTitle = styled.h3`
  font-weight: 700;
`

const bgImageStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
}

const Home = () => (
  <ErrorBoundary>
    <Layout>
      <OuterContainer>
        <StyledSimpleBar>
          <Container>
            <StaticImage
              style={bgImageStyle}
              alt="Ophrys"
              src="../images/ophr-ara.jpg"
              layout="fullWidth"
            />
            <PageTitle align="center" variant="h6" color="inherit">
              Bedrohte Pflanzenarten fördern
            </PageTitle>
            <CardContainer>
              <Card>
                <CardTitle>Arten</CardTitle>
                Sehr seltene und gefährdete Pflanzenarten, für welche der Kanton
                Zürich eine besondere Verantwortung hat. Für jede wurde ein
                Aktionsplan erstellt.
              </Card>
              <Card>
                <CardTitle>Artverantwortliche</CardTitle>
                Für jede Aktionsplanart ist ein Experte oder eine Expertin
                verantwortlich.
              </Card>
              <Card>
                <CardTitle>Populationen</CardTitle>
                Die Pflanzen einer Art bilden kleine oder grosse Populationen,
                je nachdem wie günstig die Bedingungen sind.
              </Card>
              <Card>
                <CardTitle>Ziele</CardTitle>
                beschreiben, wie sich die Populationen künftig entwickeln
                sollen, damit die Art langfristig erhalten bleibt.
              </Card>
              <Card>
                <CardTitle>Idealbiotope</CardTitle>
                Wo Aktionsplanarten gut gedeihen, werden die
                Standortsbedingungen analysiert. Daraus lassen sich Idealbiotope
                ableiten. Diese geben den Massstab vor für die Aufwertung und
                die Schaffung von neuen Wuchsorten.
              </Card>
              <Card>
                <CardTitle>Massnahmen</CardTitle>
                Primär werden die Lebensräume der ursprünglichen Vorkommen der
                Aktionsplanarten gemäss ihrer Ansprüche aufgewertet. Sekundär
                werden Aktionsplanarten vermehrt, um bestehende Populationen
                durch Ansiedlungen zu verstärken oder um neue Populationen zu
                gründen.
              </Card>
              <Card>
                <CardTitle>Kontrollen</CardTitle>
                Artverantwortliche und Freiwillige besuchen Populationen,
                erfassen die Grösse des Bestandes und überprüfen die Wirkung der
                Massnahmen.
              </Card>
              <Card>
                <CardTitle>Berichte</CardTitle>
                Jährlich verfassen die Artverantwortlichen einen Bericht über
                die Entwicklung der Populationen, den Erfolg der Massnahmen und
                die Erreichung der Ziele.
              </Card>
              <Card>
                <CardTitle>Planung</CardTitle>
                Aufgrund der in den Jahresberichten dargestellten Erfahrungen
                planen die Artverantwortlichen die Massnahmen und Kontrollen für
                das folgende Jahr.
              </Card>
              <Card>
                <CardTitle>Beobachtungen</CardTitle>
                Die Artverantwortlichen prüfen von Dritten gemeldete
                Beobachtungen und ordnen diese den Populationen der
                Aktionsplanarten zu.
              </Card>
              <Card>
                <CardTitle>Freiwillige</CardTitle>
                unterstützen die Artverantwortlichen bei der Kontrolle von
                Populationen und der{' '}
                <a
                  href="//vermehrung.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vermehrung von Aktionsplanarten
                </a>
                .
              </Card>
              <Card>
                <CardTitle>Organisation des Projektes</CardTitle>
                durch&nbsp;
                <a
                  href="//toposmm.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  topos
                </a>
                &nbsp;im Auftrag der&nbsp;
                <a
                  href="//aln.zh.ch/internet/baudirektion/aln/de/naturschutz/artenfoerderung/ap_fl.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fachstelle Naturschutz des Kantons Zürich
                </a>
                .
                <p>
                  Die App wird von&nbsp;
                  <a
                    href="https://gabriel-software.ch"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gabriel-Software
                  </a>
                  &nbsp;entwickelt.
                </p>
              </Card>
            </CardContainer>
          </Container>
        </StyledSimpleBar>
      </OuterContainer>
    </Layout>
  </ErrorBoundary>
)

export default Home

export const Head = () => <Header />
