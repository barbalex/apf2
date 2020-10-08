import React, { useCallback, useRef, useEffect } from 'react'
import 'react-markdown-editor-lite/lib/index.css'
import MarkdownIt from 'markdown-it'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import Editor, { Plugins } from 'react-markdown-editor-lite'
import { useField } from 'formik'

import Label from '../../Label'

Editor.use(Plugins.AutoResize, {
  min: 47,
  max: 1000,
})

const mdParser = new MarkdownIt({ breaks: true })

const EditorContainer = styled.div`
  margin-bottom: 12px;
  .editorpane {
    overflow-y: auto !important;
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

const MarkdownField = ({ label, disabled, ...props }) => {
  const [field, meta] = useField(props)
  const { onBlur, onChange, value, name } = field
  const { error: errors } = meta
  const error = errors?.[name]

  const change = useCallback(
    ({ html, text }) => {
      const fakeEvent = {
        target: {
          name,
          value: text,
        },
      }
      onChange(fakeEvent)
      onBlur(fakeEvent)
    },
    [name, onBlur, onChange],
  )

  const el = useRef(null)

  useEffect(() => {
    const myEl = el.current.nodeMdText.current
    myEl.focus()
    // need to ensure the focus is at the end of the text
    // not the beginning
    // see: https://stackoverflow.com/a/35951917/712005
    var val = myEl.value
    myEl.value = ''
    myEl.value = val
  }, [])

  return (
    <EditorContainer>
      <Label label={label} />
      <Editor
        ref={el}
        id={name}
        value={value ?? ''}
        renderHTML={(text) => mdParser.render(text)}
        onChange={change}
        config={config}
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </EditorContainer>
  )
}

export default MarkdownField
