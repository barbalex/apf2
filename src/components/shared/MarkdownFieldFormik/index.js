import React from 'react'
import { FocusWithin } from 'react-focus-within'
import { useField } from 'formik'

import Editor from './Editor'
import Presenter from './Presenter'
import TextField from '../TextField'

// render:
// - TextField if no value exists
// - markdown presenter if value exists
// - markdown editor if is focused
const MdFieldFormik = (props) => {
  const [field] = useField(props)
  const { label } = props
  const { value, name } = field

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
