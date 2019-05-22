import React from 'react'
import Typography from '@material-ui/core/Typography'
import MaterialCard from '@material-ui/core/Card'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Img from 'gatsby-image'

import ErrorBoundary from '../components/shared/ErrorBoundary'
import Layout from '../components/Layout'

const ScrollContainer = styled.div`
  height: calc(100vh - 64px);
  overflow-y: auto;
  margin-top: 64px;
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
    grid-row-gap: 40px;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 40px;
    grid-row-gap: 80px;
  }
  @media (min-width: 1700px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 65px;
    grid-row-gap: 130px;
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
  font-weight: 900;
`

const bgImageStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
}

export default ({ data }) => {
  //console.log("Page index")
  return (
    <ErrorBoundary>
      <Layout>
        <ScrollContainer>
          <Container>
            <Img
              sizes={data.file.childImageSharp.sizes}
              fluid={data.file.childImageSharp.fluid}
              style={bgImageStyle}
            />
            <PageTitle align="center" variant="h6" color="inherit">
              Bedrohte Pflanzen fördern
            </PageTitle>
            <CardContainer>
              <Card>
                <CardTitle>Arten</CardTitle>
                Sorgfältig ausgewählte, vom Aussterben bedrohte Pflanzen-Arten.
              </Card>
              <Card>
                <CardTitle>Aktionspläne</CardTitle>
                Für jede Art ist ein ausgewiesener Experte oder eine Expertin
                verantwortlich.
              </Card>
              <Card>
                <CardTitle>Populationen</CardTitle>
                Hier leben die Arten noch - oder wieder. Populationen sind die
                Basis für Ziele, Massnahmen, Kontrollen und Berichte.
              </Card>
              <Card>
                <CardTitle>Ziele</CardTitle>
                ...beschreiben, wie sich die Populationen künftig entwickeln
                sollen, damit die Art langfristig erhalten bleibt.
              </Card>
              <Card>
                <CardTitle>Massnahmen</CardTitle>
                Die Arten werden gezielt gefördert. Zum Beispiel durch
                Lebensraum-Verbesserung oder{' '}
                <a
                  href="//vermehrung.apflora.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vermehrung und Aussetzung
                </a>
                .
              </Card>
              <Card>
                <CardTitle>Kontrollen</CardTitle>
                Profis und Freiwillige besuchen Populationen, erfassen den
                Bestand und prüfen die Wirkung von Massnahmen.
              </Card>
              <Card>
                <CardTitle>Berichte</CardTitle>
                Jährlich wird über die Entwicklung der Populationen, den Erfolg
                der Massnahmen und die Erreichung der Ziele berichtet.
              </Card>
              <Card>
                <CardTitle>Planung</CardTitle>
                Aufgrund der Berichte und Erfahrungen werden die Massnahmen und
                Kontrollen für das nächste Jahr geplant.
              </Card>
              <Card>
                <CardTitle>Beobachtungen</CardTitle>
                Gemeldete Beobachtungen Dritter werden überprüft.
              </Card>
              <Card>
                <CardTitle>Freiwillige</CardTitle>
                ...unterstützen die Profis bei der Kontrolle von Populationen
                und der{' '}
                <a
                  href="//vermehrung.apflora.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vermehrung von Pflanzen
                </a>
                .
              </Card>
              <Card>
                <CardTitle>Wer organisiert das Projekt?</CardTitle>
                <a
                  href="//toposmm.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Topos
                </a>
                &nbsp;im Auftrag der{' '}
                <a
                  href="//aln.zh.ch/internet/baudirektion/aln/de/naturschutz/artenfoerderung/ap_fl.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fachstelle Naturschutz des Kantons Zürich
                </a>
                .
              </Card>
              <Card>
                <CardTitle>Interessiert?</CardTitle>
                <p>
                  Möchten Sie den Kanton Zürich bei diesem Projekt unterstützen?
                  Fragen Sie&nbsp;
                  <a
                    href="//toposmm.ch/index.php?option=com_content&view=article&id=21:vegapzh1&catid=8&Itemid=115"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Topos
                  </a>
                  .
                </p>
                <p>
                  Sie suchen ein Werkzeug, um ein Art-Förder-Programm zu
                  verwalten? Fragen Sie&nbsp;
                  <a
                    href="https://gabriel-software.ch/Kontakt/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    den Entwickler
                  </a>
                  .
                </p>
              </Card>
            </CardContainer>
          </Container>
        </ScrollContainer>
      </Layout>
    </ErrorBoundary>
  )
}

export const query = graphql`
  query Query {
    file(relativePath: { eq: "ophr-ara.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
        sizes {
          ...GatsbyImageSharpSizes
        }
      }
    }
  }
`
