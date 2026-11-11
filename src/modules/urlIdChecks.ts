import { validate as isUuid } from 'uuid'

export interface UrlIdCheck {
  /** index of the id within the activeNodeArray */
  index: number
  id: string
  /** PostgREST view proving existence, i.e. q_ap */
  view: string
  /** column of view that must equal the parent id the url names */
  parent?: { column: string; id: string } | undefined
}

interface VariantDef {
  view: string
  /** id positions after the folder name, i.e. 2 for AP-Ziele/<jahr>/<zielId> */
  idOffset?: number | undefined
  parentColumn?: string | undefined
  parentFolders?: string[] | undefined
}

interface FolderDef {
  /** set unless the folder is defined purely by variants */
  view?: string | undefined
  idOffset?: number | undefined
  parentColumn?: string | undefined
  parentFolders?: string[] | undefined
  /**
   * the same folder name exists at several levels ('AP-Berichte' below
   * the projekt and below the art): the first variant whose folder has
   * been seen wins; a variant without folders is the fallback
   */
  variants?: { folders: string[]; def: VariantDef }[] | undefined
}

const kontrFolders = ['Feld-Kontrollen', 'Freiwilligen-Kontrollen']

/**
 * One entry per url folder that is followed by an id, naming the view
 * that proves the id's existence and the column tying it to the parent
 * id named earlier in the url - so a valid id under a wrong parent is
 * caught as well.
 *
 * Folders outside the Projekte hierarchy (Benutzer, EKF, Beobachtungen,
 * Dateien) are deliberately absent: their rows are not constrained by
 * the url's own parent chain (rls on user, beobs of other arts), a
 * missing row could not be distinguished from a hidden one - and
 * forwarding on a hidden row would loop with the freiwillig redirect.
 */
const folderDefs: Record<string, FolderDef> = {
  Projekte: { view: 'v_projekt' },
  Arten: { view: 'q_ap', parentColumn: 'proj_id', parentFolders: ['Projekte'] },
  Populationen: {
    view: 'q_pop',
    parentColumn: 'ap_id',
    parentFolders: ['Arten'],
  },
  'Teil-Populationen': {
    view: 'q_tpop',
    parentColumn: 'pop_id',
    parentFolders: ['Populationen'],
  },
  'Feld-Kontrollen': {
    view: 'q_tpopkontr',
    parentColumn: 'tpop_id',
    parentFolders: ['Teil-Populationen'],
  },
  'Freiwilligen-Kontrollen': {
    view: 'q_tpopkontr',
    parentColumn: 'tpop_id',
    parentFolders: ['Teil-Populationen'],
  },
  Zaehlungen: {
    view: 'q_tpopkontrzaehl',
    parentColumn: 'tpopkontr_id',
    parentFolders: kontrFolders,
  },
  Massnahmen: {
    view: 'q_tpopmassn',
    parentColumn: 'tpop_id',
    parentFolders: ['Teil-Populationen'],
  },
  'AP-Ziele': {
    view: 'q_ziel',
    idOffset: 2,
    parentColumn: 'ap_id',
    parentFolders: ['Arten'],
  },
  'AP-Erfolgskriterien': {
    view: 'q_erfkrit',
    parentColumn: 'ap_id',
    parentFolders: ['Arten'],
  },
  'AP-Berichte': {
    variants: [
      {
        folders: ['Arten'],
        def: { view: 'q_apber', parentColumn: 'ap_id', parentFolders: ['Arten'] },
      },
      {
        folders: [],
        def: {
          view: 'q_apberuebersicht',
          parentColumn: 'proj_id',
          parentFolders: ['Projekte'],
        },
      },
    ],
  },
  Taxa: { view: 'q_apart', parentColumn: 'ap_id', parentFolders: ['Arten'] },
  'assoziierte-Arten': {
    view: 'q_assozart',
    parentColumn: 'ap_id',
    parentFolders: ['Arten'],
  },
  'EK-Frequenzen': {
    view: 'q_ekfrequenz',
    parentColumn: 'ap_id',
    parentFolders: ['Arten'],
  },
  'EK-Zähleinheiten': {
    view: 'q_ekzaehleinheit',
    parentColumn: 'ap_id',
    parentFolders: ['Arten'],
  },
  'Massnahmen-Berichte': {
    variants: [
      {
        folders: ['Teil-Populationen'],
        def: {
          view: 'q_tpopmassnber',
          parentColumn: 'tpop_id',
          parentFolders: ['Teil-Populationen'],
        },
      },
      {
        folders: ['Populationen'],
        def: {
          view: 'q_popmassnber',
          parentColumn: 'pop_id',
          parentFolders: ['Populationen'],
        },
      },
    ],
  },
  'Kontroll-Berichte': {
    variants: [
      {
        folders: ['Teil-Populationen'],
        def: {
          view: 'q_tpopber',
          parentColumn: 'tpop_id',
          parentFolders: ['Teil-Populationen'],
        },
      },
      {
        folders: ['Populationen'],
        def: {
          view: 'q_popber',
          parentColumn: 'pop_id',
          parentFolders: ['Populationen'],
        },
      },
    ],
  },
}

export const buildUrlIdChecks = (
  activeNodeArray: (string | number)[],
): UrlIdCheck[] => {
  const checks: UrlIdCheck[] = []
  // ids of the folders already passed; parents always precede their children
  const idByFolder = new Map<string, string>()

  activeNodeArray.forEach((segment, index) => {
    if (typeof segment !== 'string') return
    const def = folderDefs[segment]
    if (!def) return

    const effectiveDef: VariantDef | undefined = def.variants ?
        (def.variants.find((variant) =>
          variant.folders.some((folder) => idByFolder.has(folder)),
        )?.def ?? def.variants.at(-1)?.def)
      : def.view ?
        {
          view: def.view,
          idOffset: def.idOffset,
          parentColumn: def.parentColumn,
          parentFolders: def.parentFolders,
        }
      : undefined
    if (!effectiveDef) return

    const id = activeNodeArray[index + (effectiveDef.idOffset ?? 1)]
    if (typeof id !== 'string' || !isUuid(id)) return

    const parentFolder = effectiveDef.parentFolders?.find((folder) =>
      idByFolder.has(folder),
    )
    const parentId = parentFolder ? idByFolder.get(parentFolder) : undefined
    const parentColumn = effectiveDef.parentColumn
    checks.push({
      index: index + (effectiveDef.idOffset ?? 1),
      id,
      view: effectiveDef.view,
      parent:
        parentId && parentColumn ? { column: parentColumn, id: parentId } : undefined,
    })
    idByFolder.set(segment, id)
  })

  return checks
}
