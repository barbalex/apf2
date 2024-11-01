import { memo } from 'react'
// extracted to shared component due to peer dependency to old react version
// import { FocusWithin } from 'react-focus-within'

import { Editor } from './Editor/index.jsx'
import { Presenter } from './Presenter.jsx'
import { TextField } from '../TextField.jsx'
import { FocusWithin } from '../FocusWithin.jsx'

// render:
// - TextField if no value exists
// - markdown presenter if value exists
// - markdown editor if is focused
// problems with react-focus-within: maybe use https://stackoverflow.com/a/63857071/712005
export const MarkdownField = memo((props) => {
  const { label, value } = props

  return (
    <FocusWithin>
      {({ isFocused, focusProps }) => (
        <div {...focusProps}>
          {isFocused ?
            <Editor {...props} />
          : value ?
            <Presenter
              value={value}
              label={label}
            />
          : <TextField {...props} />}
        </div>
      )}
    </FocusWithin>
  )
})
