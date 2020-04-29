import React, { useCallback, Suspense, lazy } from 'react'
import 'react-markdown-editor-lite/lib/index.css'
import MarkdownIt from 'markdown-it'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaExpandArrowsAlt } from 'react-icons/fa'

import Label from './Label'

// need to lazy import because it calls navigator which busts gatsby build
const MdEditor = lazy(() => import('react-markdown-editor-lite'))

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  position: relative;
  margin-bottom: 12px;
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
      <Suspense fallback={<div>Lade...</div>}>
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
      </Suspense>
    </Container>
  )
}

export default observer(MarkdownField)
