import { DokuDate } from '..'

const VideosFuerDenEinstieg = () => (
  <>
    <h1>Anleitung zur Eingabe (inhaltlich), topos</h1>
    <DokuDate>14.02.2022</DokuDate>
    <object
      data="https://ucarecdn.com/a6435d2d-a3dd-47ee-adae-25f3f47b5bc6/APFloraDB_Anleitung_inhaltlich_topos_20220214.pdf"
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
          href="https://ucarecdn.com/a6435d2d-a3dd-47ee-adae-25f3f47b5bc6/APFloraDB_Anleitung_inhaltlich_topos_20220214.pdf"
          target="_blank"
        >
          laden Sie die Datei herunter
        </a>
        .
      </p>
    </object>
  </>
)

export default VideosFuerDenEinstieg
