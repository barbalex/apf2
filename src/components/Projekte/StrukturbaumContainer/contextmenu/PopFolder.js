// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject(`store`),
  observer
)

const PopFolder = ({ onClick, store }:{onClick:() => void, store:Object}) =>
  <ContextMenu id="popFolder" >
    <div className="react-contextmenu-title">Populationen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `pop`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `pop`,
        idTable: `ap`,
      }}
    >
      {`in Karte ${store.karte.layer.pop.visible ? `ausblenden` : `zeigen`}`}
    </MenuItem>
  </ContextMenu>

PopFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(PopFolder)
