import desktopStyles from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Falsch bestimmte Beobachtungen 👀</h1>
    <p className={desktopStyles.dokuDate}>30.01.2019</p>
    <p>Bei AP-Arten ist vorgesehen:</p>
    <ul>
      <li>das richtige Taxon anzugeben</li>
      <li>
        die Beobachtung einer Teil-Population der richtigen Art zuzuordnen
      </li>
      <li>
        ein Email an Infoflora zu schicken, um sie auf die falsche Bestimmung
        hinzuweisen
      </li>
    </ul>
    <p>Das geht so:</p>
    <ol>
      <li>Formular der Beobachtung öffnen</li>
      <li>Art korrigieren</li>
      <li>
        Es erscheint nun oberhalb ein Feld, dass die Art gemäss Original-Meldung
        anzeigt...
      </li>
      <li>...und die Beobachtung wurde zu der gewählten Art verschoben</li>
      <li>Ihr könnt sie nun einer Teil-Population dieser Art zuordnen</li>
      <li>
        Mit der entsprechenden Schaltfläche könnt ihr ein Mail an Info Flora
        generieren. Mitgeliefert werden dabei die wesentlichen Informationen zur
        Beobachtung
      </li>
      <li>Nun könnt ihr das Email ergänzen und abschicken</li>
    </ol>
    <p>
      Es gibt einen passenden Export, genannt: &quot;Alle Beobachtungen, bei
      denen die Art verändert wurde&quot;.
    </p>
  </>
)
