import React, { useCallback } from 'react'
import 'react-markdown-editor-lite/lib/index.css'
import MarkdownIt from 'markdown-it'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import Editor, { Plugins } from 'react-markdown-editor-lite'

import Label from '../Label'

Editor.use(Plugins.AutoResize, {
  min: 100,
  max: 1000,
})

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  margin-bottom: 12px;
  .editorpane,
  .html-wrap,
  .rc-md-navigation {
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

const MarkdownField = ({ field, form, label, disabled }) => {
  const { onBlur, onChange, value, name } = field
  const { errors } = form
  const error = errors[name]

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

  return (
    <Container>
      <Label label={label} />
      <Editor
        value={value}
        renderHTML={(text) => mdParser.render(text)}
        onChange={change}
        config={config}
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </Container>
  )
}

export default MarkdownField
