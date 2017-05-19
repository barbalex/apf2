import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardText } from 'material-ui/Card'

const FirstLevelCard = styled(Card)`
  margin-bottom: 10px;
`
const SecondLevelCard = styled(Card)`
  margin-bottom: 5px;
`

const Tipps = () => (
  <FirstLevelCard>
    <CardHeader title="Tipps und Tricks" actAsExpander showExpandableButton />
    <CardText expandable>
      Exporte werden als .csv-Datei heruntergeladen.
      <SecondLevelCard>
        <CardHeader
          title="Was ist eine .csv-Datei?"
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          {'Eine reine Textdatei, deren Name mit ".csv" endet.'}<br />
          {'"csv" steht für: "comma separated values".'}<br />
          {'Die Datei hat folgende Eigenschaften:'}
          <ol>
            <li>
              {
                'Datenbank-Felder werden mit Kommas (,) getrennt ("Feldtrenner")'
              }
            </li>
            <li>
              {
                'Text in Feldern wird in Hochzeichen (") eingefasst ("Texttrenner")'
              }
            </li>
            <li>
              {'Die erste Zeile enthält die Feldnamen'}
            </li>
            <li>
              {'Der Zeichenstatz ist Unicode UTF-8'}<br />
              {
                'Ist ein falscher Zeichensatz gewählt, werden Sonderzeichen wie z.B. Umlaute falsch angezeigt.'
              }
            </li>
          </ol>
        </CardText>
      </SecondLevelCard>
      <SecondLevelCard>
        <CardHeader
          title="Wie öffne ich diese Datei?"
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          Es gibt zwei Möglichkeiten:
          <ol>
            <li>
              {'Heruntergeladene Datei doppelklicken.'}<br />
              {'Meist wählt das Betriebssystem ein geeignetes Programm.'}<br />
              {
                'Dieses Programm erkennt hoffentlich, dass der Importassistent verwendet werden muss.'
              }
              <br />
              {'In Excel funktioniert dies häufig nicht!'}
            </li>
            <li>
              {
                'Gewünschtes Programm öffnen und damit die Datei öffnen (z.B. in Libre Office) oder die Daten importieren (z.B. in Excel).'
              }
              <br />
              {
                'Das Programm öffnet den Importassistenten, in dem man Feldtrenner, Texttrenner und Zeichensatz wählt. Und, ob die erste Zeile die Feldnamen enthält.'
              }
            </li>
          </ol>
        </CardText>
      </SecondLevelCard>
      <SecondLevelCard>
        <CardHeader
          title="Welches Programm soll ich verwenden?"
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          {
            'Um die Datei das erste Mal zu öffnen eignet sich Libre Office am besten: '
          }
          <a
            href="https://de.libreoffice.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://de.libreoffice.org
          </a>
          <p>
            {
              'Microsoft Excel eignet sich sehr gut, um die Daten danach auswerten.'
            }
            <br />
            {
              'Speichern Sie die Datei daher in Libre Office als .xlsx-Datei ab und öffnen Sie sie danach mit Excel.'
            }
          </p>
          <SecondLevelCard>
            <CardHeader
              title="Sie wollen die .csv-Datei direkt in Excel öffnen? Das wird nicht empfohlen, aber hier erfahren Sie, wie es funktionieren kann:"
              actAsExpander
              showExpandableButton
            />
            <CardText expandable>
              <ol>
                <li>Excel öffnen</li>
                <li>
                  {'"Daten" > "Externe Daten abrufen" > "Aus Text" wählen'}
                </li>
                <li>
                  {'Nun erscheit der Textkonvertierungs-Assistent.'}<br />
                  {
                    'Im Schritt 1 als Dateiursprung statt dem vorgegebenen "Windows (ANSI)" dies hier wählen: "65001 : Unicode (UTF-8)". Excel versteht sonst partout keine Umlaute.'
                  }
                </li>
                <li>
                  {'Vorsicht: Excel vermanscht regelmässig importierte Daten!'}
                  <br />
                  {
                    'Beim Importieren interpretiert es nämlich in jedem Feld die obersten paar Datensätze - und bestimmt einen Datentyp, ohne Sie zu fragen.'
                  }
                  <br />
                  {
                    'Auch wenn weiter unten in vielen Datensätzen die Daten bei der nun nötigen Umwandlung in diesen Datentyp in diesem Feld dadurch verändert oder gelöscht werden, weil sie nicht diesem Datentyp entsprechen.'
                  }
                  <br />
                  {
                    'Daher bitte Excel nur für die Auswertung von Daten benutzten - nicht um .csv-Dateien zu öffnen.'
                  }
                </li>
              </ol>
            </CardText>
          </SecondLevelCard>
        </CardText>
      </SecondLevelCard>
      <SecondLevelCard>
        <CardHeader
          title="Hilfe, ich sehe nur ungeordnete Daten!"
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          {
            'Das Programm hat wohl beim Öffnen die Feld-Grenzen nicht richtig erkannt.'
          }
          <ul>
            <li>{'Öffnen Sie die Datei nochmals'}</li>
            <li>
              {
                'Suchen Sie dabei die Option, mit der eine Trennung der Felder mittels Kommas erzwungen werden kann'
              }
            </li>
            <li>
              {
                'Vielleicht muss wie in Excel statt dem Öffnen-Befehl ein Import-Befehl verwendet werden'
              }
            </li>
            <li>
              {
                'Vorsicht: Es sollte nicht noch zusätzlich eine andere Option gewählt sein, z.B. Trennung durch Kommas UND Strichpunkte'
              }
            </li>
          </ul>
        </CardText>
      </SecondLevelCard>
      <SecondLevelCard>
        <CardHeader
          title="Hilfe, das sind viel zu viele Daten!"
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          {'Meist werden alle verfügbaren Datensätze und Felder exportiert.'}
          <br />
          {
            'Daher können Listen sehr viele Zeilen und Spalten enthalten und unübersichtlich werden.'
          }
          <ul>
            <li>Filtern Sie die Zeilen nach gewünschten Kriterien</li>
            <li>Blenden Sie unerwünschte Spalten aus oder löschen Sie sie</li>
          </ul>
        </CardText>
      </SecondLevelCard>
    </CardText>
  </FirstLevelCard>
)

export default Tipps
