import React from 'react'
import { FocusWithin } from 'react-focus-within'

import Editor from './Editor'
import Presenter from './Presenter'
import TextField from '../TextField'

// render:
// - TextField if no value exists
// - markdown presenter if value exists
// - editor if is focused
const MdFieldFormik = (props) => {
  const { label } = props
  const { value, name } = props.field

  return (
    <FocusWithin>
      {({ isFocused, focusProps }) => (
        <div {...focusProps}>
          {isFocused ? (
            <Editor {...props} />
          ) : !!value ? (
            <Presenter value={value} label={label} />
          ) : (
            <TextField
              value={value}
              label={label}
              name={name}
              saveToDb={() => {}}
            />
          )}
        </div>
      )}
    </FocusWithin>
  )
}

export default MdFieldFormik
