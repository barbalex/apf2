import { DokuDate } from '..'

const KarteFilter = () => (
  <>
    <h1>Karte: Filter</h1>
    <DokuDate>09.02.2022</DokuDate>
    <object
      data="https://ucarecdn.com/08ef33aa-0b63-419e-a7bb-da0d48dfdc21/KartenFilter_Anleitung_20220209.pdf"
      type="application/pdf"
      style={{
        width: 'calc(100% + 50px)',
        height: 'calc(100% + 50px)',
        marginLeft: -25,
        marginRight: -25,
        marginBottom: -25,
      }}
    >
      <p>
        Dieser Browser unterstützt die Anzeige von PDFs nicht. Bitte&nbsp;
        <a
          rel="noopener noreferrer"
          href="https://ucarecdn.com/08ef33aa-0b63-419e-a7bb-da0d48dfdc21/KartenFilter_Anleitung_20220209.pdf"
          target="_blank"
        >
          laden Sie die Datei herunter
        </a>
        .
      </p>
    </object>
  </>
)

export default KarteFilter
