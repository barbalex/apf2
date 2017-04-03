// @flow
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
import shouldUpdate from 'recompose/shouldUpdate'

const StyledAppBar = styled(AppBar)`
  @media print {
    display: none !important;
  }
`
const Button = styled(({ visible, ...rest}) => <FlatButton {...rest} />)`
  color: ${(props) => (props.visible ? `rgb(255, 255, 255) !important` : `rgba(255, 255, 255, 0.298039) !important`)}
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  > button {
    padding-top: 4px !important;
  }
`
const iconMenuAnchorOrigin = { horizontal: `left`, vertical: `bottom` }
const iconMenuTargetOrigin = { horizontal: `left`, vertical: `top` }
const iconMenuStyle = { paddingLeft: 10 }

/**
 * checking props change according to
 * https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html
 */
const checkPropsChange = (props, nextProps) =>
  nextProps.store.urlQuery.projekteTabs.join() !== props.store.urlQuery.projekteTabs.join() ||
  nextProps.store.user.name !== props.store.user.name

const enhance = compose(
  inject(`store`),
  shouldUpdate(checkPropsChange),
  withHandlers({
    onClickButton: props => (name) => {
      const { store } = props
      const projekteTabs = clone(store.urlQuery.projekteTabs) || []
      const isVisible = projekteTabs.includes(name)
      if (isVisible) {
        remove(projekteTabs, el => el === name)
      } else {
        projekteTabs.push(name)
      }
      store.setUrlQuery(`projekteTabs`, projekteTabs)
    },
    ueberApfloraChOnTouchTap: props => () =>
      window.open(`https://github.com/FNSKtZH/apflora/wiki`)
    ,
  }),
  withHandlers({
    onClickButtonStrukturbaum: props => () => props.onClickButton(`tree`),
    onClickButtonDaten: props => () => props.onClickButton(`daten`),
    onClickButtonKarte: props => () => props.onClickButton(`karte`),
    onClickButtonExporte: props => () => props.onClickButton(`exporte`),
  }),
  observer
)

const MyAppBar = ({
  store,
  onClickButtonStrukturbaum,
  onClickButtonDaten,
  onClickButtonKarte,
  onClickButtonExporte,
  ueberApfloraChOnTouchTap,
}) => {
  const projekteTabs = clone(store.urlQuery.projekteTabs) || []
  const treeIsVisible = projekteTabs.includes(`tree`)
  const datenIsVisible = projekteTabs.includes(`daten`) && !projekteTabs.includes(`exporte`)
  const karteIsVisible = projekteTabs.includes(`karte`)
  const exporteIsVisible = projekteTabs.includes(`exporte`)

  return (
    <StyledAppBar
      title="AP Flora"
      iconElementRight={
        <MenuDiv>
          <Button
            label="Strukturbaum"
            visible={treeIsVisible}
            onClick={onClickButtonStrukturbaum}
          />
          <Button
            label="Daten"
            visible={datenIsVisible}
            onClick={onClickButtonDaten}
          />
          <Button
            label="Karte"
            visible={karteIsVisible}
            onClick={onClickButtonKarte}
          />
          <Button
            label="Exporte"
            visible={exporteIsVisible}
            onClick={onClickButtonExporte}
          />
          <IconMenu
            iconButtonElement={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            anchorOrigin={iconMenuAnchorOrigin}
            targetOrigin={iconMenuTargetOrigin}
            style={iconMenuStyle}
          >
            <MenuItem
              primaryText="Stammdaten aktualisieren (Arteigenschaften, Adressen, Auswahllisten)"
              onTouchTap={store.fetchStammdaten}
            />
            <MenuItem
              primaryText="über apflora.ch"
              onTouchTap={ueberApfloraChOnTouchTap}
            />
            <MenuItem
              primaryText={`${store.user.name} abmelden`}
              onTouchTap={store.logout}
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
  onClickButtonStrukturbaum: PropTypes.func.isRequired,
  onClickButtonDaten: PropTypes.func.isRequired,
  onClickButtonKarte: PropTypes.func.isRequired,
  ueberApfloraChOnTouchTap: PropTypes.func.isRequired,
}

export default enhance(MyAppBar)
