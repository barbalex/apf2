// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject(`store`),
  observer
)

const Pop = ({ onClick, store }:{onClick:() => void,store:Object}) =>
  <ContextMenu id="pop" >
    <div className="react-contextmenu-title">Population</div>
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
        action: `delete`,
        table: `pop`,
      }}
    >
      löschen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `highlightOnMap`,
        actionTable: `pop`,
        idTable: `pop`,
      }}
    >
      Population auf Karte hervorheben
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `tpop`,
        idTable: `ap`,
      }}
    >
      {`Teil-Populationen in Karte ${store.map.layer.tpop.visible ? `ausblenden` : `zeigen`}`}
    </MenuItem>
  </ContextMenu>

Pop.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(Pop)
