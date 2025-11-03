import { dokuDate } from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Technische Voraussetzungen</h1>
    <p className={dokuDate}>20.12.2024</p>
    <p>
      Vorausgesetzt wird ein <strong>moderner Browser</strong>:
    </p>
    <ul>
      <li>
        Empfehlenswert sind Chromium basierte Browser wie Google Chrome oder
        Microsoft Edge - apflora.ch wird auf Chrome entwickelt.
        <br />
        Meines Wissens funktionieren gewisse Ausdrucke nur auf Chromium richtig
        (Stand 2020: möglich, dass das nicht mehr zutrifft).
        <br />
        Alles Andere sollte prinzipiell auch auf allen anderen modernen Browsern
        funktionieren.
      </li>
      <li>Firefox wird regelmässig produktiv benutzt</li>
      <li>Safari auf Mac OsX scheint zu funktionieren</li>
    </ul>
    <p>&nbsp;</p>
  </>
)
