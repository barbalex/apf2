import { memo } from 'react'
import MarkdownIt from 'markdown-it'
import styled from '@emotion/styled'

import { Label } from '../Label.jsx'

const mdParser = new MarkdownIt({ breaks: true })

const EditorContainer = styled.div`
  margin-bottom: 19px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  p {
    margin: 0 0 5px 0;
  }
  div {
    line-height: 23px;
  }
`

// setting tabIndex on Presenter to make it focusable
// see: https://stackoverflow.com/a/16261525/712005
export const Presenter = memo(({ value, label }) => (
  <EditorContainer tabIndex="0">
    <Label label={label} />
    <div dangerouslySetInnerHTML={{ __html: mdParser.render(value || '') }} />
  </EditorContainer>
))
