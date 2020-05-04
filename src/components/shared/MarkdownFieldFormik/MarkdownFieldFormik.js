import React, { useCallback } from 'react'
import 'react-markdown-editor-lite/lib/index.css'
import MarkdownIt from 'markdown-it'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { FaExpandArrowsAlt } from 'react-icons/fa'
import MdEditor from 'react-markdown-editor-lite'

import Label from '../Label'

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  margin-bottom: 12px;
  position: relative;
  .rc-md-editor {
    min-height: 200px;
    resize: vertical;
    overflow: hidden;
  }
  .editorpane {
    overflow-y: auto !important;
  }
  .editorpane,
  .html-wrap,
  .rc-md-navigation {
    background-color: #fffde7 !important;
  }
`
// this is to show an expanding symbol in the lower right corner
// so user realizes he can expand by pulling it
const ExpandContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: -6px;
  svg {
    font-size: 0.8em;
    color: #6b6b6b;
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
      <MdEditor
        value={value}
        renderHTML={(text) => mdParser.render(text)}
        onChange={change}
        config={config}
      />
      <ExpandContainer>
        <FaExpandArrowsAlt />
      </ExpandContainer>
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </Container>
  )
}

export default MarkdownField
