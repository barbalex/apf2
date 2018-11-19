// @flow
import { initial as ap } from './ap'
import { initial as pop } from './pop'
import { initial as tpop } from './tpop'
import { initial as tpopmassn } from './tpopmassn'
import { initial as tpopfeldkontr } from './tpopfeldkontr'
import { initial as tpopfreiwkontr } from './tpopfreiwkontr'

export const initial = {
  activeTable: null,
  ap,
  pop,
  tpop,
  tpopkontr: {},
  tpopfeldkontr,
  tpopfreiwkontr,
  tpopkontrzaehl: {},
  tpopmassn,
  ziel: {},
  zielber: {},
  erfkrit: {},
  apber: {},
  apberuebersicht: {},
  ber: {},
  idealbiotop: {},
  assozart: {},
  ekfzaehleinheit: {},
  popber: {},
  popmassnber: {},
  tpopber: {},
  tpopmassnber: {},
  apart: {},
  projekt: {},
  beob: {},
  beobprojekt: {},
  adresse: {},
  gemeinde: {},
  user: {},
}
