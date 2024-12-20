import { useCallback, useRef, useEffect, useState, memo } from 'react'
import MarkdownIt from 'markdown-it'
import FormHelperText from '@mui/material/FormHelperText'
import styled from '@emotion/styled'
import ReactMarkdownEditor, { Plugins } from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import { Label } from '../../Label.jsx'

ReactMarkdownEditor.use(Plugins.AutoResize, {
  min: 47,
  max: 1000,
})

const mdParser = new MarkdownIt({ breaks: true })

const EditorContainer = styled.div`
  margin-bottom: 12px;
  .editorpane {
    overflow-y: hidden !important;
  }
  .editorpane,
  .html-wrap,
  .rc-md-navigation {
    background-color: #fffde7 !important;
  }
  /* without this full page view is white */
  .rc-md-editor {
    background-color: #fffde7 !important;
  }
`
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

export const Editor = memo(
  ({ label, value: valuePassed, name, saveToDb, error }) => {
    const [value, setValue] = useState()
    useEffect(() => setValue(valuePassed), [valuePassed])

    const onChange = useCallback((props) => {
      const { text } = props
      setValue(text)
    }, [])

    const onBlur = useCallback(() => {
      const fakeEvent = {
        target: {
          name,
          value,
        },
      }
      // console.log('MarkdownField saving fakeEvent:', { fakeEvent })
      saveToDb(fakeEvent)
    }, [name, saveToDb, value])

    const el = useRef(null)

    useEffect(() => {
      const myEl = el.current.nodeMdText.current
      myEl.focus()
      // need to ensure the focus is at the end of the text
      // not the beginning
      // see: https://stackoverflow.com/a/35951917/712005
      const val = myEl.value
      myEl.value = ''
      myEl.value = val
    }, [])

    return (
      <EditorContainer>
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
      </EditorContainer>
    )
  },
)
