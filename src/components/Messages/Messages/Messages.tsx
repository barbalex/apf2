import Button from '@mui/material/Button'
import MarkdownIt from 'markdown-it'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useAtomValue } from 'jotai'

import { createUsermessage } from '../createUsermessage.ts'
import { userNameAtom } from '../../../store/index.ts'

import styles from './Messages.module.css'

const mdParser = new MarkdownIt({ breaks: true, linkify: true })
const defaultLinkOpen =
  mdParser.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
mdParser.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('target', '_blank')
  tokens[idx].attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export const Messages = ({ unreadMessages }) => {
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickRead = async (message) => {
    await apolloClient.mutate({
      mutation: createUsermessage,
      variables: { userName, id: message.id },
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['UsermessagesQuery'],
    })
  }

  return (
    <div className={styles.container}>
      {unreadMessages.map((m, index) => {
        const paddBottom = index === unreadMessages.length - 1
        const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

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
              onClick={() => onClickRead(m)}
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
