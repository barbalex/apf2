import React from 'react'
import Typography from '@material-ui/core/Typography'
import MaterialCard from '@material-ui/core/Card'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Img from 'gatsby-image'
import ErrorBoundary from 'react-error-boundary'

import Layout from '../components/Layout'

const ScrollContainer = styled.div`
  height: calc(100vh - 64px);
  overflow-y: auto;
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

export default ({ data }) => (
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
            Bedrohte Pflanzenarten fördern
          </PageTitle>
          <CardContainer>
            <Card>
              <CardTitle>Aktionsplanarten</CardTitle>
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
              Die Pflanzen einer Art bilden kleine oder grosse Populationen, je
              nachdem wie günstig die Bedingungen für die Art sind.
            </Card>
            <Card>
              <CardTitle>Ziele</CardTitle>
              beschreiben, wie sich die Populationen künftig entwickeln sollen,
              damit die Art langfristig erhalten bleibt.
            </Card>
            <Card>
              <CardTitle>Idealbiotope</CardTitle>
              Wo Aktionsplanarten gut gedeihen, werden die Standortsbedingungen
              analysiert. Daraus lassen sich Idealbiotope ableiten. Diese geben
              den Massstab vor für die Aufwertung und die Schaffung von neuen
              Wuchsorten.
            </Card>
            <Card>
              <CardTitle>Massnahmen</CardTitle>
              Primär werden die Lebensräume der ursprünglichen Vorkommen der
              Aktionsplanarten gemäss ihrer Ansprüche aufgewertet. Sekundär
              werden Aktionsplanarten vermehrt, um bestehende Populationen durch
              Ansiedlungen zu verstärken oder um neue Populationen zu gründen.
            </Card>
            <Card>
              <CardTitle>Kontrollen</CardTitle>
              Die Artverantwortlichen, aber auch Freiwillige besuchen
              Populationen, erfassen die Grösse des Bestandes und überprüfen die
              Wirkung der Massnahmen.
            </Card>
            <Card>
              <CardTitle>Berichte</CardTitle>
              Jährlich verfassen die Artverantwortlichen einen Bericht über die
              Entwicklung der Populationen, den Erfolg der Massnahmen und die
              Erreichung der Ziele.
            </Card>
            <Card>
              <CardTitle>Planung</CardTitle>
              Aufgrund der in den Jahresberichten dargestellten Erfahrungen
              planen die Artverantwortlichen die Massnahmen und Kontrollen für
              das folgende Jahr.
            </Card>
            <Card>
              <CardTitle>Beobachtungen</CardTitle>
              Die Artverantwortlichen prüfen von Dritten gemeldete Beobachtungen
              und ordnen diese den Populationen der Aktionsplanarten zu.
            </Card>
            <Card>
              <CardTitle>Freiwillige</CardTitle>
              unterstützen die Artverantwortlichen bei der Kontrolle von
              Populationen und der{' '}
              <a
                href="//vermehrung.apflora.ch"
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
              <a href="//toposmm.ch" target="_blank" rel="noopener noreferrer">
                {'topos Marti & Müller AG'}
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
                Die Applikation wird von&nbsp;
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
      </ScrollContainer>
    </Layout>
  </ErrorBoundary>
)

export const query = graphql`
  query indexPageQuery {
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
