import { DokuDate } from '..'

const OpenSource = () => (
  <>
    <h1>Open source</h1>
    <DokuDate>30.01.2019</DokuDate>
    <p>
      <a
        href="https://github.com/barbalex/apf2/blob/master/license.md"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://img.shields.io/badge/license-ISC-brightgreen.svg"
          alt="js-standard-style"
        />
      </a>
    </p>
    <p>
      Die verwendete{' '}
      <a
        href="https://github.com/barbalex/apf2/blob/master/license.md"
        target="_blank"
        rel="noreferrer"
      >
        Lizenz
      </a>{' '}
      ist sehr freizügig.
    </p>
    <p>
      Neben dem Code steht auch die{' '}
      <a
        href="https://github.com/barbalex/apf2/tree/master/sql/apflora"
        target="_blank"
        rel="noreferrer"
      >
        Datenstruktur
      </a>{' '}
      zur Verfügung. Die eigentlichen Daten aber, mit denen gearbeitet wird,
      gehören der Fachstelle Naturschutz des Kantons Zürich und stehen nicht zur
      freien Verfügung.
    </p>
    <p>
      Die Beobachtungen werden an{' '}
      <a
        href="//www.infoflora.ch/de/allgemeines/info-species.html"
        target="_blank"
        rel="noreferrer"
      >
        Info Spezies
      </a>{' '}
      geliefert.
    </p>
  </>
)

export default OpenSource
