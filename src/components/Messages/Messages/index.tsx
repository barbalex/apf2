import { Messages } from './Messages.tsx'
import type { MessageNode } from '../index.tsx'
import styles from './index.module.css'

export const MessagesList = ({
  unreadMessages,
}: {
  unreadMessages: MessageNode[]
}) => (
  <div className={styles.scrollContainer}>
    <Messages unreadMessages={unreadMessages} />
  </div>
)
