import { DokuDate } from '..'

const Geschichte = () => (
  <>
    <h1>Entstehungs-Geschichte</h1>
    <DokuDate>18.04.2019</DokuDate>
    <h2>Ab 1995: Excel-Listen</h2>
    <p>
      Vor langer, langer Zeit begann im Kanton Zürich ein Projekt zur Förderung
      der am stärksten gefährdeten Pflanzen-Arten. Möglicherweise war das kurz
      nach 1995, als das Naturschutz-Gesamtkonzept entstand.
    </p>
    <p>
      Im Rahmen des Projekts wurden Populationen und Teil-Populationen
      beschrieben, Massnahmen dokumentiert, Teil-Populationen kontrolliert und
      vieles mehr. Um Ende Jahr darüber zu berichten, wurden die Daten
      systematisch gesammelt. So entstanden viele Excel-Listen. Über die Jahre
      wuchsen die Bedürfnisse an das Projekt und damit auch die Listen. Bis die
      Mitarbeitenden sich bessere Instrumente wünschten 😝
    </p>
    <h2>Ab 2005: Access-DB</h2>
    <p>
      Ungefähr im Jahr 2005 wurde eine Access-Datenbank aufgebaut. Dank guter
      Datenstruktur und einer im Vergleich zu Excel-Listen bequemen
      Benutzeroberfläche war das Verwalten der Projekt-Daten nun viel einfacher
      😄
    </p>
    <p>
      In den nächsten Jahren stiegen die Anforderungen weiter. Bis die
      Access-Datenbank ihnen nicht mehr genügen konnte. Nicht nur stiess sie an
      Leistungsgrenzen (vor allem wegen hunderttausender auszuwertenden
      Beobachtungen). Es wuchs die Anzahl Mitarbeitende. Diese erfassen nach der
      Feldsaison unter Termindruck und möglichst gleichzeitig alle Daten, damit
      rechtzeitig die nächste Feldsaison geplant werden kann. Sie arbeiten in
      vielen verschiedenen Ökobüros. Daher genügte es nicht mehr, eine zentrale
      Datenbank zu pflegen 😬
    </p>
    <h2>2010: Verteilte Access-DB&#39;s</h2>
    <p>
      Es wurde versucht, Ende der Feldsaison Access-DB&#39;s an die
      Mitarbeitenden zu verteilen. Diese erfassten die Daten und schickten sie
      zurück. Danach wurden die Daten vereinigt bzw. synchronisiert. Theoretisch
      hätte das Access machen können sollen. Praktisch war es ein Flop 👎
    </p>
    <h2>2011: Access-DB mit MySQL Backend</h2>
    <p>
      Ca. 2011 wurde die Datenbank auf MySQL auf einem Webserver migriert. Als
      Anwendung diente weiterhin Access, bei jedem Benutzer installiert und über
      ODBC mit der Datenbank kommunizierend. Es funktionierte grundsäztlich.
      Aber es war kompliziert, langsam und bei weitem nicht perfekt 😒
    </p>
    <h2>Ab 2012: Web-Applikation</h2>
    <p>
      Ab 2012 kam eine reine Web-App zum Einsatz, kombiniert mit einer passenden
      Datenbank (MySQL). Sie war leistungsfähig und konnte die damaligen
      Bedürfnisse gut decken 👍
      <br />
      Leider war sie auch komplex, schwierig zu unterhalten und risikoreich
      weiter zu entwickeln 👀
    </p>
    <h2>Ab 2017: Moderne Web-App</h2>
    <p>
      Web-Technologien entwickelten sich rasant weiter. Ebenso, wie die
      Bedürfnisse an apflora.ch. 2017 wurde apflora daher von Grund auf neu
      aufgebaut 🚀. Hauptziel war es, mit Hilfe einer modernen Architektur
      (React, GraphQL, MobX) sowie einer flexibleren Datenbank (PostgreSQL, u.a.
      mit JSON) die Komplexität der Anwendung stark zu reduzieren. Und die Basis
      zu legen, dass sie auch künftig bedürfnissgerecht weiterentwickelt werden
      kann.
    </p>
    <p>Diese Ziele wurden erreicht ✨.</p>
    <p>
      Heute wird apflora regelmässig modernisiert.{' '}
      <a href="../technologien">Hier</a> finden Sie Informationen über die
      aktuell verwendeten Technologien.
    </p>
  </>
)

export default Geschichte
