import { DokuDate } from '..'

const BenutzerKonti = () => (
  <>
    <h1>Benutzer-Konti</h1>
    <DokuDate>29.04.2020</DokuDate>
    <h3>Grundsätze</h3>
    <ul>
      <li>
        Die Projektleitung bestimmt, wer Zugriff auf apflora.ch bekommt (={' '}
        <strong>Benutzer</strong>)
      </li>
      <li>
        Für Benutzer erstellen Topos-Mitarbeiterinnen ein <strong>Konto</strong>
        . Dabei wird:
        <ul>
          <li>
            ein <strong>Benutzer-Name</strong> vergeben (wechseln zu email?)
          </li>
          <li>ein initiales Passwort gesetzt</li>
          <li>
            eine <strong>Rolle</strong> vergeben. Sie bestimmt, was der Benutzer
            in apflora.ch machen kann. Verfügbare Rollen:
            <ul>
              <li>
                <strong>reader</strong>: können alle Daten lesen, nicht aber
                bearbeiten (typischerweise FNS-Mitarbeiter)
              </li>
              <li>
                <strong>ap_reader</strong>: können alle Daten ausgewählter Arten
                lesen, nicht aber bearbeiten
              </li>
              <li>
                <strong>freiwillig</strong>: Personen, welche (freiwillig)
                Kontrollen durchführen. Und nur diese Kontrollen sehen und
                bearbeiten können sollen
              </li>
              <li>
                <strong>ap_writer</strong>: Personen, die für eine Art
                verantwortlich sind und daher deren Daten bearbeiten können. Die
                übrigen Arten sind für sie sicht- aber nicht bearbeitbar
              </li>
              <li>
                <strong>manager</strong>: Personen, welche alle Daten lesen und
                schreiben dürfen. Meist MitarbeiterInnen von Topos
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        Neue Benutzer werden von der Topos-Mitarbeiterin informiert, dass sie
        über ein Konto verfügen, inklusive Benuzter-Name und initialem Passwort
      </li>
      <li>
        Neue Benutzer können ihr Passwort anpassen (Art-Verantwortliche im
        Navigations-Baum bei ihrem Benutzer, Freiwillige oben rechts wo ihr Name
        erscheint)
      </li>
    </ul>
  </>
)

export default BenutzerKonti
