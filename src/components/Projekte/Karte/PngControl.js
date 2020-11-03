import React, { useCallback, useState, useEffect } from 'react'
import 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-easyprint'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import { MdGetApp } from 'react-icons/md'

//import { baseLayers } from './LayersControl/BaseLayers'
//import storeContext from '../../../storeContext'

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
`

const options = {
  hidden: true,
  position: 'topright',
  exportOnly: true,
  filename: 'apfloraKarte',
  hideControlContainer: true,
}

const PngControl = () => {
  //const { activeBaseLayer } = useContext(storeContext)
  const map = useMap()
  const [printPlugin, changePrintPlugin] = useState({})

  const savePng = useCallback(
    (event) => {
      event.preventDefault()
      printPlugin.printMap('CurrentSize', 'apfloraKarte')
    },
    [printPlugin],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const pp = window.L.easyPrint(options)
    pp.addTo(map)
    changePrintPlugin(pp)

    return () => {
      pp.remove()
    }
  }, [map])

  //const layer = baseLayers.find(l => l.value === activeBaseLayer)
  //const sendsCors = layer && layer.cors
  //if (!sendsCors) return null

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
