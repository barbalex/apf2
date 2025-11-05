import { Messages } from './Messages.jsx'
import { scrollContainer } from './index.module.css'

export const MessagesList = ({ unreadMessages }) => (
  <div className={scrollContainer}>
    <Messages unreadMessages={unreadMessages} />
  </div>
)
