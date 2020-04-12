/**
 * usinf react-mde fork https://github.com/fhessenberger/react-mde
 * because of autoGrow feature that andrerpena will not implement
 * see: https://github.com/andrerpena/react-mde/pull/209#issuecomment-583604908
 */
import React, { useState, useCallback } from 'react'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import 'react-mde/lib/styles/css/react-mde-all.css'

import Label from './Label'

const StyledReactMde = styled(ReactMde)`
  .mde-text,
  .mde-header,
  .grip {
    background: #fffde7 !important;
  }
`

const enL18n = {
  write: 'bearbeiten',
  preview: 'Vorschau',
}

const MarkdownField = ({ field, form, label, disabled }) => {
  const { onBlur, onChange, value, name } = field
  const { errors } = form
  const error = errors[name]

  const [selectedTab, setSelectedTab] = useState('write') // or: preview
  const change = useCallback(
    (value) => {
      const fakeEvent = {
        target: {
          name,
          value,
        },
      }
      onChange(fakeEvent)
      onBlur(fakeEvent)
    },
    [name, onBlur, onChange],
  )

  return (
    <>
      <Label label={label} />
      <StyledReactMde
        value={value}
        onChange={change}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<ReactMarkdown source={markdown} />)
        }
        l18n={enL18n}
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </>
  )
}

export default observer(MarkdownField)
