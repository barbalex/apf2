import React from 'react'
import { FocusWithin } from 'react-focus-within'

import Editor from './Editor'
import Presenter from './Presenter'

// need to lazy import because react-markdown-editor-lite calls navigator which busts gatsby build
const MdFieldFormik = (props) => {
  const { label } = props
  const { value } = props.field

  return (
    <FocusWithin>
      {({ isFocused, focusProps }) => (
        <div {...focusProps}>
          {isFocused ? (
            <Editor {...props} />
          ) : (
            <Presenter value={value} label={label} />
          )}
        </div>
      )}
    </FocusWithin>
  )
}

export default MdFieldFormik
