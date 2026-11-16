// export state: beob field order, export file type
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import {
  treeApGqlFilterAtom,
  treeBeobGqlFilterAtom,
  treeEkGqlFilterAtom,
  treeEkfGqlFilterAtom,
  treePopGqlFilterAtom,
  treeTpopGqlFilterAtom,
  treeTpopkontrGqlFilterAtom,
  treeTpopmassnGqlFilterAtom,
} from './filters.ts'

// sortedBeobFields
const defaultSortedBeobFields = [
  'taxon',
  'ESPECE',
  'presence',
  'PRESENCE',
  'xy_radius',
  'abundance_cat',
  'abundance',
  'CAT_ABONDANCE_1',
  'XY_PRECISION',
  'observers',
  'NOM_PERSONNE_OBS',
  'PRENOM_PERSONNE_OBS',
  'obs_day',
  'obs_month',
  'obs_year',
  'J_NOTE',
  'M_NOTE',
  'A_NOTE',
  'remarks',
  'locality_descript',
  'DESC_LOCALITE',
  'DESC_LOCALITE_',
  'municipality',
  'canton',
  'NOM_COMMUNE',
  'CO_CANTON',
  'interpretation_note',
  'doubt_status',
  'phenology_code',
  'count_unit',
  'obs_type',
  'original_taxon',
  'taxon_expert',
  'determinavit_cf',
  'specimen_type',
  'NOM_ORIGINAL',
  'NOM_COMPLET',
  'introduction',
  'DETERMINAVIT_CF',
  'DETERMINAVIT_CF_',
  'x_swiss',
  'y_swiss',
  'COORDONNEE_FED_E',
  'COORDONNEE_FED_N',
  'FNS_XGIS',
  'FNS_YGIS',
  'STATION',
]

// needs to update when defaultSortedBeobFields is changed - thus not with storage
export const sortedBeobFieldsAtom = atom(defaultSortedBeobFields)

export const setSortedBeobFieldsAtom = atom(
  null,
  (_get, set, val: (string | undefined)[]) => {
    set(
      sortedBeobFieldsAtom,
      val.filter((v): v is string => !!v),
    )
  },
)

// exportFileType
export const exportFileTypeAtom = atomWithStorage(
  'exportFileType',
  'xlsx',
  undefined,
  { getOnInit: true },
)

export const setExportFileTypeAtom = atom(null, (_get, set, val: string) => {
  set(exportFileTypeAtom, val)
})

// Helper to get gql filter atom by table name
export const getGqlFilterAtomByTable = (table: string) => {
  const atomMap = {
    ap: treeApGqlFilterAtom,
    pop: treePopGqlFilterAtom,
    tpop: treeTpopGqlFilterAtom,
    tpopmassn: treeTpopmassnGqlFilterAtom,
    ek: treeEkGqlFilterAtom,
    ekf: treeEkfGqlFilterAtom,
    tpopkontr: treeTpopkontrGqlFilterAtom,
    beobNichtBeurteilt: treeBeobGqlFilterAtom('nichtBeurteilt'),
    beobNichtZuzuordnen: treeBeobGqlFilterAtom('nichtZuzuordnen'),
    beobZugeordnet: treeBeobGqlFilterAtom('zugeordnet'),
  }
  return (atomMap as Record<string, unknown>)[table]
}
