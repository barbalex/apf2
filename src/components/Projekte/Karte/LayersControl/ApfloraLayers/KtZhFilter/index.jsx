import { useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../storeContext.js'

const LayerDiv = styled.div`
  min-height: 24px;
  // z-index is needed because leaflet
  // sets high one for controls
  z-index: 2000;
`
const StyledButton = styled(Button)`
  text-transform: none;
  font-weight: normal;
  font-size: 1em;
  padding: 6px 5px;
  width: 100%;
  justify-content: flex-start;
`

export const KtZhFilter = observer(() => {
  const store = useContext(StoreContext)
  const { setMapFilter, incrementMapFilterResetter } = store.tree

  const onClickFilterZh = useCallback(() => {
    import('./ktZh.json').then((module) => {
      const ktZh = module.default
      incrementMapFilterResetter()
      setMapFilter(ktZh)
    })
  }, [incrementMapFilterResetter, setMapFilter])

  return (
    <LayerDiv>
      <StyledButton
        title="Kt. ZH filtern"
        onClick={onClickFilterZh}
        color="inherit"
      >
        Kanton Zürich filtern
      </StyledButton>
    </LayerDiv>
  )
})
