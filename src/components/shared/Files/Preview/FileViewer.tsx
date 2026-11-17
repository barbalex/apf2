import { useEffect, useState } from 'react'

import styles from './FileViewer.module.css'

interface Props {
  fileId: string
  name: string
  fileMimeType: string
}

// these are not rendered locally: the Microsoft office viewer fetches
// the file itself, via the (public) Uploadcare URL
const officeMimeTypes = new Set([
  'application/vnd.oasis.opendocument.text',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export const FileViewer = ({ fileId, name, fileMimeType }: Props) => {
  const fileUri = `https://ucarecdn.com/${fileId}/${name}`
  const isOffice = officeMimeTypes.has(fileMimeType)
  const isVideo = fileMimeType === 'video/mp4'

  const [text, setText] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (isOffice || isVideo) return
    const controller = new AbortController()
    setText(null)
    setFailed(false)
    fetch(fileUri, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.text()
      })
      .then(setText)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setFailed(true)
        }
      })
    return () => controller.abort()
  }, [fileUri, isOffice, isVideo])

  if (isOffice) {
    return (
      <iframe
        className={styles.iframe}
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUri)}`}
        title="Office-Vorschau"
      />
    )
  }

  if (isVideo) {
    return <video className={styles.video} controls src={fileUri} />
  }

  if (failed) {
    return (
      <div className={styles.message}>Vorschau konnte nicht geladen werden.</div>
    )
  }

  if (text === null) {
    return <div className={styles.message}>Lade Vorschau …</div>
  }

  // html files are shown as source on purpose: rendering them would need
  // an iframe that has to stay sandboxed
  return <pre className={styles.pre}>{text}</pre>
}
