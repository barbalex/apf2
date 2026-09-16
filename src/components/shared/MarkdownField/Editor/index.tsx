import { useRef, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import MarkdownIt from 'markdown-it'
import FormHelperText from '@mui/material/FormHelperText'
import ReactMarkdownEditor, { Plugins } from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import { Label } from '../../Label.tsx'
import type { SaveToDbHandler } from '../../types.ts'
import styles from './index.module.css'

// .use() is the editor's plugin API, not a React hook
// eslint-disable-next-line react-hooks/rules-of-hooks
ReactMarkdownEditor.use(Plugins.AutoResize, {
  min: 47,
  max: 1000,
})

const mdParser = new MarkdownIt({ breaks: true })

const config = {
  view: { menu: true, md: true, html: false },
  canView: {
    menu: true,
    md: true,
    html: true,
    fullScreen: true,
    hideMenu: false,
  },
  markdownClass: 'editorpane',
}

export interface EditorProps {
  label?: string | undefined
  value?: string | null | undefined
  name: string
  saveToDb: SaveToDbHandler
  error?: string | null | undefined
}

export const Editor = ({
  label,
  value: valuePassed,
  name,
  saveToDb,
  error,
}: EditorProps) => {
  const [value, setValue] = useState<string | null | undefined>(valuePassed)
  useEffect(() => setValue(valuePassed), [valuePassed])

  const onChange = (props: { text: string }) => {
    const { text } = props
    setValue(text)
  }

  const onBlur = () => {
    const fakeEvent = {
      target: {
        name,
        value: value ?? null,
      },
    }
    void saveToDb(fakeEvent)
  }

  const el = useRef<ReactMarkdownEditor>(null)

  // react-markdown-editor-lite renders its toolbar buttons as non-focusable
  // <span>s. Clicking one would move focus from the textarea to <body>, so the
  // parent's useFocusWithin collapses the editor back to the presenter.
  // Prevent that default focus shift on toolbar interaction; the toolbar's
  // onClick still fires and focus stays in the textarea.
  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.rc-md-navigation')) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    // nodeMdText is private in the editor's typings
    const editor = el.current as unknown as {
      nodeMdText: { current: HTMLTextAreaElement | null }
    } | null
    const myEl = editor?.nodeMdText.current
    if (!myEl) return
    myEl.focus()
    // need to ensure the focus is at the end of the text
    // not the beginning
    // see: https://stackoverflow.com/a/35951917/712005
    const val = myEl.value
    myEl.value = ''
    myEl.value = val
  }, [])

  return (
    <div
      className={`${styles.container} react-markdown-editor-lite`}
      onMouseDown={onMouseDown}
    >
      <Label label={label} />
      <ReactMarkdownEditor
        ref={el}
        id={name}
        value={value ?? ''}
        renderHTML={(text) => mdParser.render(text)}
        onChange={onChange}
        onBlur={onBlur}
        config={config}
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </div>
  )
}
