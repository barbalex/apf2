import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { MdEditNote } from 'react-icons/md'
import { remove } from 'es-toolkit'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { StyledButton, StyledIconButton } from './index.jsx'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.js'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'

export const Daten = ({ treeNr = '', hide = false }) => {
  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const isDaten = projekteTabs.includes(`daten${treeNr}`)
  const isTree = projekteTabs.includes(`tree${treeNr}`)

  const [isDesktopView] = useAtom(isDesktopViewAtom)

  const onClickButton = () => {
    const copyOfProjekteTabs = [...projekteTabs]
    if (isDesktopView) {
      if (copyOfProjekteTabs.includes(`daten${treeNr}`)) {
        remove(copyOfProjekteTabs, (el) => el === `daten${treeNr}`)
      } else {
        copyOfProjekteTabs.push(`daten${treeNr}`)
      }
      setProjekteTabs(copyOfProjekteTabs)
    } else {
      // show one tab only
      setProjekteTabs([`daten${treeNr}`])
    }
  }

  let followed = projekteTabs.includes('filter')
  if (treeNr === '2') {
    followed = projekteTabs.includes('filter2')
  }

  return (
    <Tooltip
      title={
        isDesktopView ? 'Formulare anzeigen' : (
          'Mobil-Navigation und Formulare anzeigen'
        )
      }
    >
      {isDesktopView ?
        <StyledButton
          variant={isDaten ? 'outlined' : 'text'}
          preceded={isTree.toString()}
          followed={followed.toString()}
          onClick={onClickButton}
          data-id={`nav-daten${treeNr || 1}`}
        >
          {`Daten${treeNr === '2' ? ' 2' : ''}`}
        </StyledButton>
      : <StyledIconButton
          variant={isDaten ? 'outlined' : 'text'}
          preceded={isTree.toString()}
          followed={followed.toString()}
          onClick={onClickButton}
          data-id={`nav-daten${treeNr || 1}`}
        >
          <MdEditNote />
        </StyledIconButton>
      }
    </Tooltip>
  )
}
