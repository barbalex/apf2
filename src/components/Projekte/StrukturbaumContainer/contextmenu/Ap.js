// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject(`store`),
  observer
)

const Ap = ({ onClick, store }:{onClick:() => void,store:Object}) =>
  <ContextMenu id="ap" >
    <div className="react-contextmenu-title">Art</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ap`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `ap`,
      }}
    >
      löschen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `pop`,
        idTable: `ap`,
      }}
    >
      {`Populationen in Karte ${store.map.pop.visible ? `ausblenden` : `zeigen`}`}
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `tpop`,
        idTable: `ap`,
      }}
    >
      {`Teil-Populationen in Karte ${store.map.tpop.visible ? `ausblenden` : `zeigen`}`}
    </MenuItem>
  </ContextMenu>

Ap.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(Ap)
