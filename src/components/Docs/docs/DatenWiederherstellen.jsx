import { DokuDate } from '..'

const DatenWiederherstellen = () => (
  <>
    <h1>Daten aus Sicherung herstellen</h1>
    <DokuDate>18.11.2021</DokuDate>
    <p>
      Soll eine Datenbank aus einer Sicherung wiederhergestellt werden, geht das
      so:
    </p>
    <h3>1. Datenbank erstellen</h3>
    <p>Entweder in pgAdmin oder:</p>
    <pre>
      <code className="language-sql" lang="sql">
        CREATE DATABASE apflora encoding &#39;UTF8&#39;;
      </code>
    </pre>
    <h3>2. Rollen erstellen</h3>
    <pre>
      <code className="language-sql" lang="sql">
        create role apflora_reader; <br />
        create role apflora_ap_reader; <br />
        create role apflora_manager in group apflora_reader; <br />
        create role apflora_ap_writer in group apflora_reader; <br />
        create role apflora_freiwillig; <br />
        create role anon; <br />
        create role authenticator with login password PASSWORD noinherit; <br />
        grant connect on database apflora to authenticator; <br />
        grant connect on database apflora to anon; <br />
        grant anon to authenticator;
        <br />
      </code>
    </pre>
    <p>
      anon und authenticator werden für das Login benutzt.
      <br />
      apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_freiwillig
      und apflora_manager sind Benutzer mit unterschiedlichen Rechten.
    </p>
    <h3>3. Aus Sicherung wiederherstellen</h3>
    <pre>
      <code>
        pg_restore --dbname=apflora --port 5432 --username POSTGRES_USER
        <br />
        --no-password --verbose &quot;/sik_data/apflora.backup&quot;
      </code>
    </pre>
    <h3>4. JWT Secret setzen</h3>
    <pre>
      <code>
        ALTER DATABASE apflora SET &quot;app.jwt_secret&quot; TO &#39;INSERT
        SECRET&#39;;
      </code>
    </pre>
  </>
)

export default DatenWiederherstellen
