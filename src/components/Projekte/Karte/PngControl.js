import React, { useCallback, useState, useEffect } from 'react'
import 'leaflet'
import { useLeaflet } from 'react-leaflet'
import 'leaflet-easyprint'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import FileDownloadIcon from '@material-ui/icons/GetApp'

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
`

const options = {
  hidden: true,
  position: 'topright',
  // sizeModes may not be needed?
  sizeModes: ['Current'],
  exportOnly: true,
  filename: 'apfloraKarte',
  hideControlContainer: true,
}

const PngControl = () => {
  const [printPlugin, changePrintPlugin] = useState({})
  const { map } = useLeaflet()

  const savePng = useCallback(event => {
    event.preventDefault()
    printPlugin.printMap('CurrentSize', 'apfloraKarte')
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const pp = window.L.easyPrint(options).addTo(map)
    changePrintPlugin(pp)
  }, [])

  return (
    <div>
      <Control position="topright">
        <StyledButton onClick={savePng} title="Karte als png speichern">
          <FileDownloadIcon />
        </StyledButton>
      </Control>
    </div>
  )
}

export default PngControl
