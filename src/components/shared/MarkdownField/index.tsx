// extracted to shared component due to peer dependency to old react version
// import { FocusWithin } from 'react-focus-within'
import React from 'react'
import { useFocusWithin } from 'react-aria'

import { Editor } from './Editor/index.tsx'
import type { EditorProps } from './Editor/index.tsx'
import { Presenter } from './Presenter.tsx'
import { TextField } from '../TextField.tsx'

// render:
// - TextField if no value exists
// - markdown presenter if value exists
// - markdown editor if is focused
// problems with react-focus-within: maybe use https://stackoverflow.com/a/63857071/712005
export const MarkdownField = (props: EditorProps) => {
  const { label, value } = props

  const [isFocusWithin, setFocusWithin] = React.useState(false)
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  })

  return (
    <div {...focusWithinProps}>
      {isFocusWithin ?
        <Editor {...props} />
      : value ?
        <Presenter
          value={value}
          label={label}
        />
      : <TextField {...props} />}
    </div>
  )
}
