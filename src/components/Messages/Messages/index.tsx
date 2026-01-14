import { Messages } from './Messages.tsx'
import styles from './index.module.css'

export const MessagesList = ({ unreadMessages }) => (
  <div className={styles.scrollContainer}>
    <Messages unreadMessages={unreadMessages} />
  </div>
)
