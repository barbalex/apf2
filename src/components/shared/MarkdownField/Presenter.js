import React from 'react'
import MarkdownIt from 'markdown-it'
import styled from 'styled-components'

import Label from '../Label'

const mdParser = new MarkdownIt({ breaks: true })

const EditorContainer = styled.div`
  margin-bottom: 12px;
  cursor: pointer;
`

// setting tabIndex on Presenter to make it focusable
// see: https://stackoverflow.com/a/16261525/712005
const Markdown = ({ value, label }) => (
  <EditorContainer tabIndex="0">
    <Label label={label} />
    <div dangerouslySetInnerHTML={{ __html: mdParser.render(value || '') }} />
  </EditorContainer>
)

export default Markdown
