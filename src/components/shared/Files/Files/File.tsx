import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { FaTimes, FaDownload } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { upperFirst } from 'es-toolkit'

import { ErrorBoundary } from '../../ErrorBoundary.tsx'
import { TextField } from '../../TextField.tsx'
import { SuspenseImage } from '../../SuspenseImage.tsx'
import {
  apFile as apFileFragment,
  idealbiotopFile as idealbiotopFileFragment,
  popFile as popFileFragment,
  tpopFile as tpopFileFragment,
  tpopkontrFile as tpopkontrFileFragment,
  tpopmassnFile as tpopmassnFileFragment,
} from '../../fragments.ts'
import { isImageFile } from '../isImageFile.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import {
  userNameAtom,
  addNotificationAtom,
} from '../../../../store/index.ts'

import styles from './File.module.css'

const StyledMenu = styled((props) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    maxHeight: 48 * 4.5,
    width: 120,
  },
}))

const fragmentObject = {
  ap: apFileFragment,
  idealbiotop: idealbiotopFileFragment,
  pop: popFileFragment,
  tpop: tpopFileFragment,
  tpopkontr: tpopkontrFileFragment,
  tpopmassn: tpopmassnFileFragment,
}

export const File = ({ file, parent, refetch }) => {
  const addNotification = useSetAtom(addNotificationAtom)

  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const tableName = `${parent}File`

  const onClickDelete = async () => {
    // 1. remove dataset
    try {
      const mutationName = `delete${upperFirst(parent)}FileById`
      await apolloClient.mutate({
        mutation: gql`
          mutation deleteDataset {
            ${mutationName}(
              input: {
                id: "${file.id}"
              }
            ) {
              ${tableName} {
                id
              }
            }
          }
        `,
      })
    } catch (error) {
      console.log(error)
      return addNotification({
        message: `Die Datei konnte nicht gelöscht werden: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
    refetch()
    setDelMenuAnchorEl(null)
  }

  const onClickDownload = () =>
    window.open(`https://ucarecdn.com/${file.fileId}/-/inline/no/`)

  const userName = useAtomValue(userNameAtom)

  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: file.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      const mutationName = `update${upperFirst(parent)}FileById`
      const fields = `${upperFirst(parent)}FileFields`
      const fragment = fragmentObject[parent]
      const parentId = `${parent}Id`
      await apolloClient.mutate({
        mutation: gql`
              mutation UpdateFile(
                $id: UUID!
                $${parentId}: UUID
                $fileId: UUID
                $fileMimeType: String
                $name: String
                $beschreibung: String
              ) {
                ${mutationName}(
                  input: {
                    id: $id
                    ${tableName}Patch: {
                      id: $id
                      ${parentId}: $${parentId}
                      fileId: $fileId
                      fileMimeType: $fileMimeType
                      name: $name
                      beschreibung: $beschreibung
                    }
                  }
                ) {
                  ${tableName} {
                    ...${fields}
                  }
                }
              }
              ${fragment}
            `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: error.message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    refetch()
  }

  if (!file) return null

  const isImage = isImageFile(file)

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {isImage ?
          <SuspenseImage
            src={`https://ucarecdn.com/${file.fileId}/-/resize/80x/-/quality/lightest/${file.name}`}
            alt={file.name}
            className={styles.img}
            fallback={<div className={styles.imgReplacement}>...</div>}
          />
        : <div className={styles.imgReplacement}>...</div>}
        <div className={styles.dateiTypField}>
          <TextField
            name="fileMimeType"
            label="Datei-Typ"
            disabled
            schrinkLabel
            value={file.fileMimeType}
            saveToDb={saveToDb}
            error={fieldErrors.fileMimeType}
          />
        </div>
        <div className={styles.spacer} />
        <div className={styles.dateiNameField}>
          <TextField
            name="name"
            label="Datei-Name"
            disabled
            schrinkLabel
            value={file.name}
            saveToDb={saveToDb}
            error={fieldErrors.name}
          />
        </div>
        <div className={styles.spacer} />
        <div className={styles.beschreibungField}>
          <TextField
            name="beschreibung"
            label="Beschreibung"
            multiLine
            schrinkLabel
            value={file.beschreibung}
            saveToDb={saveToDb}
            error={fieldErrors.beschreibung}
          />
        </div>
        <Tooltip title="herunterladen">
          <IconButton
            onClick={onClickDownload}
            className={styles.downloadIcon}
          >
            <FaDownload />
          </IconButton>
        </Tooltip>
        <Tooltip title="löschen">
          <IconButton
            aria-label="löschen"
            aria-owns={delMenuOpen ? 'delMenu' : undefined}
            aria-haspopup="true"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            className={styles.delIcon}
          >
            <FaTimes />
          </IconButton>
        </Tooltip>
        <StyledMenu
          id="delMenu"
          anchorEl={delMenuAnchorEl}
          open={delMenuOpen}
          onClose={() => setDelMenuAnchorEl(null)}
        >
          <h3 className={styles.menuTitle}>löschen?</h3>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </StyledMenu>
      </div>
    </ErrorBoundary>
  )
}
