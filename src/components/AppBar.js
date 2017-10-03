// @flow
import React from 'react'
import { toJS } from 'mobx'
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

import isMobilePhone from '../modules/isMobilePhone'

const StyledAppBar = styled(AppBar)`@media print {display: none !important;}`
const Button = styled(FlatButton)`
  color: ${props =>
    props['data-visible']
      ? 'rgb(255, 255, 255) !important'
      : 'rgba(255, 255, 255, 0.298039) !important'};
`
const TreeButton = Button.extend`
  > div > span {
    padding-right: 6px !important;
  }
`
const DatenButton = Button.extend`
  > div > span {
    padding-left: 6px !important;
  }
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  > button {
    padding-top: 4px !important;
  }
`
const StyledMoreVertIcon = styled(MoreVertIcon)`color: white !important;`
const iconMenuAnchorOrigin = { horizontal: 'left', vertical: 'bottom' }
const iconMenuTargetOrigin = { horizontal: 'left', vertical: 'top' }
const iconMenuStyle = { paddingLeft: 10 }

/**
 * checking props change according to
 * https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html
 */
const checkPropsChange = (props, nextProps) =>
  toJS(nextProps.store.urlQuery.projekteTabs).join() !==
    toJS(props.store.urlQuery.projekteTabs).join() ||
  nextProps.store.user.name !== props.store.user.name

const enhance = compose(
  inject('store'),
  shouldUpdate(checkPropsChange),
  withHandlers({
    onClickButton: props => name => {
      const { store } = props
      const projekteTabs = clone(toJS(store.urlQuery.projekteTabs))
      if (isMobilePhone()) {
        // show one tab only
        store.setUrlQueryValue('projekteTabs', [name])
      } else {
        const exporteIsVisible = projekteTabs.includes('exporte')
        const isVisible = projekteTabs.includes(name)
        if (isVisible) {
          if (name === 'daten' && exporteIsVisible) {
            remove(projekteTabs, el => el === 'exporte')
          } else {
            remove(projekteTabs, el => el === name)
          }
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            store.tree.cloneActiveNodeArrayToTree2()
          }
          if (name === 'daten' && exporteIsVisible) {
            // need to remove exporte
            // because exporte replaces daten
            remove(projekteTabs, el => el === 'exporte')
          }
        }
        store.setUrlQueryValue('projekteTabs', projekteTabs)
      }
    },
    watchVideos: props => () =>
      window.open(
        'https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J'
      ),
    showDeletedDatasets: props => () => props.store.toggleShowDeletedDatasets(),
  }),
  withHandlers({
    onClickButtonStrukturbaum: props => () => props.onClickButton('tree'),
    onClickButtonStrukturbaum2: props => () => props.onClickButton('tree2'),
    onClickButtonDaten: props => () => props.onClickButton('daten'),
    onClickButtonDaten2: props => () => props.onClickButton('daten2'),
    onClickButtonKarte: props => () => props.onClickButton('karte'),
    onClickButtonExporte: props => () => props.onClickButton('exporte'),
  }),
  observer
)

const MyAppBar = ({
  store,
  onClickButtonStrukturbaum,
  onClickButtonStrukturbaum2,
  onClickButtonDaten,
  onClickButtonDaten2,
  onClickButtonKarte,
  onClickButtonExporte,
  showDeletedDatasets,
  watchVideos,
}: {
  store: Object,
  onClickButton: () => void,
  onClickButtonStrukturbaum: () => void,
  onClickButtonStrukturbaum2: () => void,
  onClickButtonDaten: () => void,
  onClickButtonDaten2: () => void,
  onClickButtonKarte: () => void,
  onClickButtonExporte: () => void,
  showDeletedDatasets: () => void,
  watchVideos: () => void,
}) => {
  const projekteTabs = store.urlQuery.projekteTabs
  const treeIsVisible = projekteTabs.includes('tree')
  const tree2IsVisible = projekteTabs.includes('tree2')
  const datenIsVisible =
    projekteTabs.includes('daten') && !projekteTabs.includes('exporte')
  const daten2IsVisible =
    projekteTabs.includes('daten2') && !projekteTabs.includes('exporte')
  const karteIsVisible = projekteTabs.includes('karte')
  const exporteIsVisible = projekteTabs.includes('exporte')
  const exporteIsActive = !!store.tree.activeNodes.projekt
  const isMobile = isMobilePhone()

  return (
    <StyledAppBar
      title={isMobile ? '' : 'AP Flora'}
      iconElementRight={
        <MenuDiv>
          <TreeButton
            label="Strukturbaum"
            data-visible={treeIsVisible}
            onClick={onClickButtonStrukturbaum}
          />
          <DatenButton
            label="Daten"
            data-visible={datenIsVisible}
            onClick={onClickButtonDaten}
          />
          {!isMobile && (
            <TreeButton
              label="Strukturbaum 2"
              data-visible={tree2IsVisible}
              onClick={onClickButtonStrukturbaum2}
            />
          )}
          {!isMobile && (
            <DatenButton
              label="Daten 2"
              data-visible={daten2IsVisible}
              onClick={onClickButtonDaten2}
            />
          )}
          <Button
            label="Karte"
            data-visible={karteIsVisible}
            onClick={onClickButtonKarte}
          />
          {!isMobile &&
            exporteIsActive && (
              <Button
                label="Exporte"
                data-visible={exporteIsVisible}
                onClick={onClickButtonExporte}
              />
            )}
          <IconMenu
            iconButtonElement={
              <IconButton>
                <StyledMoreVertIcon />
              </IconButton>
            }
            anchorOrigin={iconMenuAnchorOrigin}
            targetOrigin={iconMenuTargetOrigin}
            style={iconMenuStyle}
          >
            {isMobile &&
              exporteIsActive && (
                <MenuItem
                  primaryText="Exporte"
                  onClick={onClickButtonExporte}
                  disabled={!exporteIsVisible}
                />
              )}
            <MenuItem
              primaryText="gelöschte Datensätze wiederherstellen"
              onClick={showDeletedDatasets}
              disabled={store.deletedDatasets.length === 0}
            />
            <MenuItem primaryText="Video-Anleitungen" onClick={watchVideos} />
            <MenuItem
              primaryText={`${store.user.name} abmelden`}
              onClick={store.logout}
            />
          </IconMenu>
        </MenuDiv>
      }
      showMenuIconButton={false}
    />
  )
}

export default enhance(MyAppBar)
