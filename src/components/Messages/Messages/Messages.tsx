import { apiInsert } from '../../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import Button from '@mui/material/Button'
import MarkdownIt from 'markdown-it'
import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useAtomValue } from 'jotai'

import { userNameAtom } from '../../../store/index.ts'
import type { MessageNode } from '../index.tsx'

import styles from './Messages.module.css'

const mdParser = new MarkdownIt({ breaks: true, linkify: true })
const defaultLinkOpen =
  mdParser.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
mdParser.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx]?.attrSet('target', '_blank')
  tokens[idx]?.attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export const Messages = ({
  unreadMessages,
}: {
  unreadMessages: MessageNode[]
}) => {
  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const onClickRead = async (message: MessageNode) => {
    await apiInsert('usermessage', {
      id: uuidv7(),
      user_name: userName,
      message_id: message.id,
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['UsermessagesQuery'],
    })
  }

  return (
    <div className={styles.container}>
      {unreadMessages.map((m, index) => {
        const paddBottom = index === unreadMessages.length - 1
        const date = DateTime.fromISO(m.time ?? '').toFormat('yyyy.LL.dd')

        return (
          <div
            className={styles.messageRow}
            key={m.id}
            style={{ paddingBottom: paddBottom ? 24 : 7 }}
          >
            <div className={styles.message}>
              <div className={styles.date}>{date}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: mdParser.render(m.message ?? ''),
                }}
              />
            </div>
            <Button
              onClick={() => void onClickRead(m)}
              color="inherit"
              className={styles.okButton}
            >
              o.k.
            </Button>
          </div>
        )
      })}
    </div>
  )
}
