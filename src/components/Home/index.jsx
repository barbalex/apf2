import Typography from '@mui/material/Typography'
import MaterialCard from '@mui/material/Card'
import styled from '@emotion/styled'

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
const ScrollContainer = styled.div`
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
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  padding: 15px;
  position: relative;
  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 30px;
    grid-row-gap: 30px;
    padding: 20px;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 40px;
    grid-row-gap: 60px;
    padding: 25px;
  }
  @media (min-width: 1700px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 65px;
    grid-row-gap: 90px;
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
const Card = styled(MaterialCard)`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.711) !important;
  font-weight: 700;
  color: black !important;
  text-shadow: 0 0 1px white;
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
const CardTitle = styled.h3`
  font-weight: 700;
  margin-top: 4px;
`

export const Component = () => (
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
    <ScrollContainer>
      <PageTitle
        align="center"
        variant="h6"
        color="inherit"
      >
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
          Die Pflanzen einer Art bilden kleine oder grosse Populationen, je
          nachdem wie günstig die Bedingungen sind.
        </Card>
        <Card>
          <CardTitle>Ziele</CardTitle>
          beschreiben, wie sich die Populationen künftig entwickeln sollen,
          damit die Art langfristig erhalten bleibt.
        </Card>
        <Card>
          <CardTitle>Idealbiotope</CardTitle>
          Wo Aktionsplanarten gut gedeihen, werden die Standortsbedingungen
          analysiert. Daraus lassen sich Idealbiotope ableiten. Diese geben den
          Massstab vor für die Aufwertung und die Schaffung von neuen
          Wuchsorten.
        </Card>
        <Card>
          <CardTitle>Massnahmen</CardTitle>
          Primär werden die Lebensräume der ursprünglichen Vorkommen der
          Aktionsplanarten gemäss ihrer Ansprüche aufgewertet. Sekundär werden
          Aktionsplanarten vermehrt, um bestehende Populationen durch
          Ansiedlungen zu verstärken oder um neue Populationen zu gründen.
        </Card>
        <Card>
          <CardTitle>Kontrollen</CardTitle>
          Artverantwortliche und Freiwillige besuchen Populationen, erfassen die
          Grösse des Bestandes und überprüfen die Wirkung der Massnahmen.
        </Card>
        <Card>
          <CardTitle>Berichte</CardTitle>
          Jährlich verfassen die Artverantwortlichen einen Bericht über die
          Entwicklung der Populationen, den Erfolg der Massnahmen und die
          Erreichung der Ziele.
        </Card>
        <Card>
          <CardTitle>Planung</CardTitle>
          Aufgrund der in den Jahresberichten dargestellten Erfahrungen planen
          die Artverantwortlichen die Massnahmen und Kontrollen für das folgende
          Jahr.
        </Card>
        <Card>
          <CardTitle>Beobachtungen</CardTitle>
          Die Artverantwortlichen prüfen von Dritten gemeldete Beobachtungen und
          ordnen diese den Populationen der Aktionsplanarten zu.
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
    </ScrollContainer>
  </OuterContainer>
)
