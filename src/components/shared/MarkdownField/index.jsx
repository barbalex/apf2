import React from 'react'
import { FocusWithin } from 'react-focus-within'

import Editor from './Editor'
import Presenter from './Presenter'
import TextField from '../TextField'

// render:
// - TextField if no value exists
// - markdown presenter if value exists
// - markdown editor if is focused
const MdField = (props) => {
  const { label, value } = props
  return (
    <FocusWithin>
      {({ isFocused, focusProps }) => (
        <div {...focusProps}>
          {isFocused ? (
            <Editor {...props} />
          ) : value ? (
            <Presenter value={value} label={label} />
          ) : (
            <TextField {...props} />
          )}
        </div>
      )}
    </FocusWithin>
  )
}

export default MdField
