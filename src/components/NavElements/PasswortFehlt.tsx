import styles from './PasswortFehlt.module.css'

// shown right of passless user nodes in the nav tree: the account is
// locked until topos assigns an initial password (Benutzer form)
export const PasswortFehlt = () => (
  <span
    className={styles.badge}
    title="Diesem Konto wurde noch kein Passwort gesetzt. Es ist gesperrt, bis topos ein initiales Passwort setzt."
  >
    Passwort fehlt
  </span>
)
