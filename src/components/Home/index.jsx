import Typography from '@mui/material/Typography'
import MaterialCard from '@mui/material/Card'

import {
  img,
  outerContainer,
  scrollContainer,
  cardContainer,
  card,
  pageTitle,
  cardTitle,
} from './index.module.css'

export const Component = () => (
  <div className={outerContainer}>
    <picture>
      <source
        srcSet="home_700.avif 700w, home_1000.avif 1000w, home_1400.avif 1400w, home_2000.avif 2000w, home_2500.avif 2500w"
        type="image/avif"
      />
      <img
        className={img}
        src="home_700.webp"
        srcSet="home_700.webp 700w, home_1000.webp 1000w, home_1400.webp 1400w, home_2000.webp 2000w, home_2500.webp 2500w"
        sizes="100vw"
        alt="Spinnen-Ragwurz"
        fetchPriority="high"
      />
    </picture>
    <div className={scrollContainer}>
      <Typography
        className={pageTitle}
        align="center"
        variant="h6"
        color="inherit"
      >
        Bedrohte Pflanzenarten fördern
      </Typography>
      <div className={cardContainer}>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Arten</h3>
          Sehr seltene und gefährdete Pflanzenarten, für welche der Kanton
          Zürich eine besondere Verantwortung hat. Für jede wurde ein
          Aktionsplan erstellt.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Artverantwortliche</h3>
          Für jede Aktionsplanart ist ein Experte oder eine Expertin
          verantwortlich.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Populationen</h3>
          Die Pflanzen einer Art bilden kleine oder grosse Populationen, je
          nachdem wie günstig die Bedingungen sind.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Ziele</h3>
          beschreiben, wie sich die Populationen künftig entwickeln sollen,
          damit die Art langfristig erhalten bleibt.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Idealbiotope</h3>
          Wo Aktionsplanarten gut gedeihen, werden die Standortsbedingungen
          analysiert. Daraus lassen sich Idealbiotope ableiten. Diese geben den
          Massstab vor für die Aufwertung und die Schaffung von neuen
          Wuchsorten.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Massnahmen</h3>
          Primär werden die Lebensräume der ursprünglichen Vorkommen der
          Aktionsplanarten gemäss ihrer Ansprüche aufgewertet. Sekundär werden
          Aktionsplanarten vermehrt, um bestehende Populationen durch
          Ansiedlungen zu verstärken oder um neue Populationen zu gründen.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Kontrollen</h3>
          Artverantwortliche und Freiwillige besuchen Populationen, erfassen die
          Grösse des Bestandes und überprüfen die Wirkung der Massnahmen.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Berichte</h3>
          Jährlich verfassen die Artverantwortlichen einen Bericht über die
          Entwicklung der Populationen, den Erfolg der Massnahmen und die
          Erreichung der Ziele.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Planung</h3>
          Aufgrund der in den Jahresberichten dargestellten Erfahrungen planen
          die Artverantwortlichen die Massnahmen und Kontrollen für das folgende
          Jahr.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Beobachtungen</h3>
          Die Artverantwortlichen prüfen von Dritten gemeldete Beobachtungen und
          ordnen diese den Populationen der Aktionsplanarten zu.
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Freiwillige</h3>
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
        </MaterialCard>
        <MaterialCard className={card}>
          <h3 className={cardTitle}>Organisation des Projektes</h3>
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
        </MaterialCard>
      </div>
    </div>
  </div>
)
