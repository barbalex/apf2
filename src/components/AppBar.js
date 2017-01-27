import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import FlatButton from 'material-ui/FlatButton'
import clone from 'lodash/clone'
import remove from 'lodash/remove'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  inject(`store`),
  withHandlers({
    onClickButton: props => (name) => {
      const { store } = props
      const projekteTabs = store.urlQuery.projekteTabs ? clone(store.urlQuery.projekteTabs) : []
      const isVisible = projekteTabs && projekteTabs.includes(name)
      if (isVisible) {
        remove(projekteTabs, el => el === name)
      } else {
        projekteTabs.push(name)
      }
      store.setUrlQuery(`projekteTabs`, projekteTabs)
    },
  }),
  observer
)

const MyAppBar = ({ store, onClickButton }) => {
  const { activeUrlElements } = store
  const projekteTabs = clone(store.urlQuery.projekteTabs)
  const strukturbaumIsVisible = projekteTabs && projekteTabs.includes(`strukturbaum`)
  const datenIsVisible = projekteTabs && projekteTabs.includes(`daten`)
  const karteIsVisible = projekteTabs && projekteTabs.includes(`karte`)
  const MenuDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    > button {
      padding-top: 4px !important;
    }
  `
  return (
    <AppBar
      title="AP Flora"
      iconElementRight={
        <MenuDiv>
          <FlatButton
            label="Strukturbaum"
            secondary={!strukturbaumIsVisible}
            onClick={() =>
              onClickButton(`strukturbaum`)
            }
          />
          <FlatButton
            label="Daten"
            secondary={!datenIsVisible}
            onClick={() => {
              onClickButton(`daten`)
            }}
          />
          <FlatButton
            label="Karte"
            secondary={!karteIsVisible}
            disabled={activeUrlElements.exporte}
            onClick={() =>
              onClickButton(`karte`)
            }
          />
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{ horizontal: `left`, vertical: `bottom` }}
            targetOrigin={{ horizontal: `left`, vertical: `top` }}
            style={{ paddingLeft: 10 }}
          >
            <MenuItem
              primaryText="Über apflora.ch"
              onTouchTap={() =>
                window.open(`https://github.com/FNSKtZH/apflora/wiki`)
              }
            />
          </IconMenu>
        </MenuDiv>
      }
      showMenuIconButton={false}
    />
  )
}

MyAppBar.propTypes = {
  store: PropTypes.object.isRequired,
  onClickButton: PropTypes.func.isRequired,
}

export default enhance(MyAppBar)
