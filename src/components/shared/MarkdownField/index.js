import React from 'react'
import { FocusWithin } from 'react-focus-within'

import Editor from './Editor'
import Presenter from './Presenter'
import TextField from '../TextField'

// render:
// - TextField if no value exists
// - markdown presenter if value exists
// - markdown editor if is focused
const MdFieldFormik = (props) => {
  const { name, label, value, saveToDb, error } = props
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

export default MdFieldFormik
