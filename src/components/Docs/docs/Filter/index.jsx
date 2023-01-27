import { DokuDate } from '../..'
import entfernen1 from './entfernen_1.png'
import formularFilter1 from './formular_filter_1.png'
import formularFilter2 from './formular_filter_2.png'
import formularFilter3 from './formular_filter_3.png'
import kartenFilter1 from './karten_filter_1.png'
import nurLabelFilter1 from './nav_label_filter_1.png'
import nurApFilter1 from './nur_ap_filter_1.png'
import uebersicht1 from './uebersicht_1.png'
import zusammenspiel from './zusammenspiel.png'
import kartenFilterEntfernen from './karten-filter-entfernen.gif'

const Filter = () => (
  <>
    <h1>Filter</h1>
    <DokuDate>08.08.2022</DokuDate>
    <p>
      Filtern hat in apflora eine lange Geschichte und wurde Schritt um Schritt
      erweitert.
      <br />
      Zuletzt im Juli 2022.
    </p>
    <h2>Welche Filter gibt es?</h2>
    <h3>1. Navigationsbaum, Hierarchie-Filter</h3>
    <p>
      Die Position in der aktuellen Navigation beeinflusst den aktuell
      angewandten Filter: Wechseln Sie mit offener Karte und darauf
      eingeblendeten Populationen von Art zu Art, werden immer deren jeweiligen
      Populationen angezeigt.
    </p>

    <h3>2. Navigationsbaum, Label-Filter</h3>
    <p>
      Im Navigationsbaum gibt es oben links den Label-Filter. Er heisst jeweils
      so, wie die aktive Ebene, z.B. &quot;Arten filtern&quot; oder
      &quot;Populationen filtern&quot;.
      <br />
      <img
        src={nurLabelFilter1}
        referrerPolicy="no-referrer"
        alt="Navigationsbaum-Filter"
      />
    </p>
    <p>
      Beispiel:
      <br />
      Erfassen Sie im Label-Filter auf Stufe Art &quot;carex&quot;, wird nach
      den Arten mit dieser Zeichenfolge im Namen gefiltert.
    </p>
    <h3>3. Navigationsbaum, nur-AP-Filter</h3>
    <p>
      Weil das Anzeigen nur der AP-Arten ein häufiger Vorgang ist (und es früher
      keine oder-Filterung gab), kann man im Navigationsbaum oben rechts mit
      einem Klick diesen Filter ein- oder ausschalten.
      <br />
      <img
        src={nurApFilter1}
        referrerPolicy="no-referrer"
        alt="nur-AP-Filter"
      />
    </p>
    <h3>4. Karten-Filter</h3>
    <p>
      Auf der Karte kann man im Layer-Tool oben rechts unter{' '}
      <code>apflora</code> ein Werkzeug für Karten-Filter einschalten. Danach
      erscheinen in der Karte oben links Werkzeuge zum Zeichnen eines Umrisses,
      für dessen Bearbeitung und Löschung.
      <br />
      <img
        src={kartenFilter1}
        referrerPolicy="no-referrer"
        alt="Karten-Filter"
      />
    </p>
    <p>
      Ist ein Umriss gezeichnet, wird er auf die Filter der Stufe Population,
      Teil-Population und Massnahmen angewandt. Es werden also nur noch
      Populationen/Teil-Populationen/Massnahmen von Teil-Populationen angezeigt,
      die innerhalb dieses Umrisses liegen.
    </p>
    <h3>5. Formular-Filter</h3>
    <p>Das ist der flexibelste Filter.</p>
    <p>
      Man öffnet ihn mit der Schaltfläche oben in der Navigationszeile, rechts
      neben der Daten-Schaltfläche:
      <br />
      <img
        src={formularFilter1}
        referrerPolicy="no-referrer"
        alt="Filter öffnen"
      />
    </p>
    <p>Es gibt ihn für diese Formulare:</p>
    <ul>
      <li>Art</li>
      <li>Population</li>
      <li>Teil-Population</li>
      <li>Massnahmen</li>
      <li>Feld-Kontrollen (EK)</li>
      <li>
        Freiwilligen-Kontrollen (EKF) (nur in der Normal-Ansicht. Freiwillige
        können das also nicht)
      </li>
    </ul>
    <p>
      Filter-Formulare entsprechen (fast) genau den normalen Formularen. Sie
      sind aber orange hinterlegt, damit nicht aus Versehen beim Filtern echte
      Daten verändert werden.
      <br />
      <img
        src={formularFilter2}
        referrerPolicy="no-referrer"
        alt="Formular-Filter"
      />
    </p>
    <p>
      Erfasst man Werte, wird der Filter nach Verlassen des Feldes oder nach
      Drücken der Enter-Taste angewandt (bei Auswahl-Feldern sofort).
    </p>
    <p>
      Filtern kann man im <code>Strukturbaum</code> <em>und</em> im{' '}
      <code>Strukturbaum 2</code>. Öffnet man den <code>Strukturbaum 2</code>,
      entspricht er genau dem <code>Strukturbaum</code>, d.h. es wird auch ein
      allfälliger Filter kopiert. Danach sind die Filter unabhängig im
      jeweiligen Navigationsbaum gültig.
    </p>
    <h4>Und-Filter</h4>
    <p>
      Erfasst man in einem Filter-Formular in mehreren Feldern Werte, müssen
      diese gleichzeitig bzw. kummulativ erfüllt sein.
    </p>
    <p>Beispiel:</p>
    <p>
      Erfasst man für die Art <code>Aktionsplan = erstellt</code> UND{' '}
      <code>Stand Umsetzung = in Umsetzung</code>, werden Arten gefiltert, deren
      Aktionsplan erstellt ist <em>und</em> sich in Umsetzung befindet.
    </p>
    <h4>Oder-Filter</h4>
    <p>
      Im Formular-Filter gibt es nummerierte Register. Und rechts daneben ein
      (zunächst inaktives) mit <code>oder</code> beschriftetes.
      <br />
      <img src={formularFilter3} referrerPolicy="no-referrer" alt="Register" />
    </p>
    <p>
      Die Nummern nummerieren Kriterien der Oder-Filterung. Sobald in einem
      Register ein Wert erfasst wurde (oder mehrere, siehe Und-Filter), wird das
      mit <code>oder</code> beschriftete Register aktiv. Klickt man darauf und
      erfasst darin weitere Werte, hat man eine Oder-Filterung geschaffen. Will
      heissen: Es wird nach Datensätzen gefiltert, die entweder die Kriterien im
      Register 1 oder diejenigen im Register 2 erfüllen. Die Anzahl Register
      bzw. oder-Kriterien ist unbeschränkt.
    </p>
    <p>
      Beispiel:
      <br />
      Will man alle ursprünglichen Populationen, filtert man im Filter-Formular
      für Populationen nach <code>ursprünglich, aktuell</code> oder{' '}
      <code>ursprünglich, erloschen</code>.
    </p>
    <h2>Wo werden Filter angewendet?</h2>
    <ul>
      <li>Im Navigationsbaum</li>
      <li>In der Karte (Populationen, Teil-Populationen)</li>
      <li>
        In einigen Exporten gibt es zwei Befehle: Neben dem normalen, der alle
        Objekte (abhängig von den Zugriffsrechten) ungefiltert exportiert, einen
        zusätzlichen der den aktuellen Filter anwendet. Er ist deaktiviert, wenn
        kein Filter existiert
      </li>
    </ul>
    <h2>Es gibt so viele Filter. Wie spielen sie zusammen?</h2>
    <p>Additiv. Will heissen: sie werden alle gleichzeitig angewandt.</p>
    <p>
      Wenn Sie im Formular-Filter mach mehreren oder-Kriterien filtern, werden
      alle übrigen Filter bei jedem einzelnen oder-Kriterium additiv d.h.
      zusätzlich angewandt.
    </p>
    <p>
      Das geht sogar so weit, dass Filter von hierarchisch höheren Filtern
      beeinflusst werden.
    </p>
    <p>
      <strong>Beispiel</strong>
      <br />
      Sie haben folgende Filter gesetzt:
    </p>
    <ul>
      <li>
        Im Navigationsbaum-Label-Filter{' '}
        <code>Art filtern: &quot;carex&quot;</code>
      </li>
      <li>Im Navigationsbaum den &quot;nur AP&quot;-Filter eingeschaltet</li>
      <li>
        Im Filter-Formular für Populationen die Kriterien{' '}
        <code>Status = &quot;angesiedelt aktuell&quot;</code> oder{' '}
        <code>Status = &quot;angesiedelt erloschen&quot;</code>
      </li>
      <li>
        Im Karten-Filter haben Sie den Sie interessierenden Umriss gezeichnet
      </li>
    </ul>
    <p>
      Resultat:
      <br />
      Im Navigationsbaum, in der Karte und in den filterbaren Exporten sehen Sie
      nur noch ursprüngliche Populationen der drei Carex-Arten, für die
      Aktionspläne bestehen oder vorgesehen sind und die im interessierenden
      Gebiet liegen.
      <br />
      <img
        src={zusammenspiel}
        referrerPolicy="no-referrer"
        alt="Zusammenspiel"
      />
    </p>
    <h2>Wie werden Filter entfernt?</h2>
    <p>
      Im Formular-Filter gibt es oben drei Symbole:
      <br />
      <img src={entfernen1} referrerPolicy="no-referrer" alt="Entfernen" />
    </p>
    <ul>
      <li>
        Mit dem linken Symbol kann man das aktuelle Kriterium der oder-Filterung
        entfernen (sichtbar als das aktive Register)
      </li>
      <li>
        Mit dem mittleren Symbol kann man den Filter in der aktiven Ebene
        entfernen (z.B. Population). Filter in anderen Ebenen bleiben erhalten
        (z.B. Art)
      </li>
      <li>
        Mit dem rechten Symbol kann man alle aktiven Filter entfernen. Das
        betrifft auch Navigationsbaum-Label-Filter, nur-AP-Filter und
        Karten-Filter. Nicht aber den hierarchischen Navigationsbaum-Filter -
        dafür wäre eine Navigation nötig und die könnte Benutzer überraschen
        bzw. ungewollt sein
      </li>
    </ul>
    <p>Den Karten-Filter kann man einzeln auf der Karte entfernen:</p>
    <img
      src={kartenFilterEntfernen}
      referrerPolicy="no-referrer"
      alt="Karten-Filter entfernen"
    />
    <h2>Es gibt so viele Filter. Wie weiss ich, welche aktiv sind?</h2>
    <p>
      Sie können natürlich im Navigationsbaum, in der Karte und im
      Formular-Filter an allen relevanten Orten nachschauen.
    </p>
    <p>
      Eine gute Übersicht erhalten Sie aber im Formular-Filter der jeweiligen
      Ebene. Dort wird aufgelistet, welche der übrigen Filter auf dieser Ebene
      wirksam sind.
      <br />
      <img src={uebersicht1} referrerPolicy="no-referrer" alt="Übersicht" />
    </p>
  </>
)

export default Filter
