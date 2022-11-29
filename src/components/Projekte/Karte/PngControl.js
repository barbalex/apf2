import React, { useCallback, useState, useEffect, useContext } from 'react'
import 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-easyprint'
import styled from '@emotion/styled'
import { MdGetApp } from 'react-icons/md'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const FileDownloadIcon = styled(MdGetApp)`
  font-size: 1.5rem;
`
const StyledButton = styled.button`
  background-color: white;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  cursor: pointer;
  svg {
    margin-left: -2px;
    padding-top: 2px;
    color: rgba(0, 0, 0, 0.7) !important;
  }
  margin-top: 7px;
`

const options = {
  hidden: true,
  position: 'topright',
  exportOnly: true,
  filename: 'apfloraKarte',
  hideControlContainer: true,
}

const PngControl = () => {
  const { setHideMapControls } = useContext(storeContext)
  const map = useMap()
  const [printPlugin, setPrintPlugin] = useState({})

  useEffect(() => {
    const pp = window.L.easyPrint(options)
    pp.addTo(map)
    setPrintPlugin(pp)

    return () => {
      pp.remove()
    }
  }, [map])

  useEffect(() => {
    map.on('easyPrint-finished', () => {
      setHideMapControls(false)
    })

    return () => {
      map.off('easyPrint-finished', () => {
        setHideMapControls(false)
      })
    }
  }, [map, setHideMapControls])

  const savePng = useCallback(
    (event) => {
      event.preventDefault()
      setHideMapControls(true)
      printPlugin.printMap('CurrentSize', 'apfloraKarte')
    },
    [printPlugin, setHideMapControls],
  )

  return (
    <StyledButton onClick={savePng} title="Karte als png speichern">
      <FileDownloadIcon />
    </StyledButton>
  )
}

export default observer(PngControl)
