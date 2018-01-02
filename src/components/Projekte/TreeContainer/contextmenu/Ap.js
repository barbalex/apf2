// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  inject('store'),
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => {
      // props.changeLabel(event.detail.data.nodeLabel)
    },
  }),
  observer
)

const Ap = ({
  onClick,
  store,
  tree,
  changeLabel,
  label,
  onShow,
}: {
  onClick: () => void,
  store: Object,
  tree: Object,
  changeLabel: () => void,
  label: string,
  onShow: () => {},
}) => {
  const moving = store.moving.table && store.moving.table === 'pop'

  return (
    <ContextMenu id={`${tree.name}ap`} collect={props => props} onShow={onShow}>
      <div className="react-contextmenu-title">Art</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'ap',
        }}
      >
        erstelle neue
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'delete',
          table: 'ap',
        }}
      >
        lösche
      </MenuItem>
      {moving && (
        <MenuItem
          onClick={onClick}
          data={{
            action: 'move',
          }}
        >
          {`verschiebe '${store.moving.label}' hierhin`}
        </MenuItem>
      )}
      {(store.map.activeApfloraLayers.includes('Pop') ||
        store.map.activeApfloraLayers.includes('Tpop')) && (
        <div>
          <div className="react-contextmenu-divider" />
          <div className="react-contextmenu-title">Karte</div>
        </div>
      )}
      {store.map.activeApfloraLayers.includes('Pop') && (
        <MenuItem
          onClick={onClick}
          data={{
            action: 'toggleTooltip',
            actionTable: 'pop',
          }}
        >
          {store.map.pop.labelUsingNr
            ? 'beschrifte Populationen mit Namen'
            : 'beschrifte Populationen mit Nummer'}
        </MenuItem>
      )}
      {store.map.activeApfloraLayers.includes('Tpop') && (
        <MenuItem
          onClick={onClick}
          data={{
            action: 'toggleTooltip',
            actionTable: 'tpop',
          }}
        >
          {store.map.tpop.labelUsingNr
            ? 'beschrifte Teil-Populationen mit Namen'
            : 'beschrifte Teil-Populationen mit Nummer'}
        </MenuItem>
      )}
    </ContextMenu>
  )
}

export default enhance(Ap)
