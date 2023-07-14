import React from 'react'
// extracted to shared component due to peer dependency to old react version
// import { FocusWithin } from 'react-focus-within'

import Editor from './Editor'
import Presenter from './Presenter'
import TextField from '../TextField'
import { FocusWithin } from '../FocusWithin'

// render:
// - TextField if no value exists
// - markdown presenter if value exists
// - markdown editor if is focused
// problems with react-focus-within: maybe use https://stackoverflow.com/a/63857071/712005
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
