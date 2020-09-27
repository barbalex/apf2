import React from 'react'
import { FocusWithin } from 'react-focus-within'

import TextField from '../TextField'
import MarkdownField from './Field'

// need to lazy import because react-markdown-editor-lite calls navigator which busts gatsby build
const MdFieldFormik = (props) => {
  const { value, name } = props.field

  return (
    <FocusWithin>
      {({ isFocused, focusProps }) => (
        <div {...focusProps}>
          {isFocused ? (
            <MarkdownField {...props} />
          ) : (
            <TextField
              value={value}
              label={props.label}
              name={name}
              multiLine={true}
              saveToDb={props.saveToDb}
            />
          )}
        </div>
      )}
    </FocusWithin>
  )
}

export default MdFieldFormik
