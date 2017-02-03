// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem, SubMenu } from 'react-contextmenu'
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
    <SubMenu
      title="Karte"
    >
      <MenuItem
        onClick={onClick}
        data={{
          action: `showOnMap`,
          actionTable: `pop`,
          idTable: `ap`,
        }}
      >
        {`Populationen ${store.map.pop.visible ? `ausblenden` : `einblenden`}`}
      </MenuItem>
      {
        store.map.pop.visible &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `toggleTooltip`,
            actionTable: `pop`,
          }}
        >
          {
            store.map.pop.labelUsingNr ?
            `Populationen mit Namen beschriften` :
            `Populationen mit Nr. beschriften`
          }
        </MenuItem>
      }
      <MenuItem
        onClick={onClick}
        data={{
          action: `showOnMap`,
          actionTable: `tpop`,
          idTable: `ap`,
        }}
      >
        {`Teil-Populationen ${store.map.tpop.visible ? `ausblenden` : `einblenden`}`}
      </MenuItem>
      {
        store.map.tpop.visible &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `toggleTooltip`,
            actionTable: `tpop`,
          }}
        >
          {
            store.map.tpop.labelUsingNr ?
            `Teil-Populationen mit Namen beschriften` :
            `Teil-Populationen mit Nr. beschriften`
          }
        </MenuItem>
      }
    </SubMenu>
  </ContextMenu>

Ap.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(Ap)
