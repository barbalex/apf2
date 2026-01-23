import { fields } from '../fields.ts'
import { appBaseUrl } from '../../../../modules/appBaseUrl.ts'
import {
  store,
  ekPlanFieldsAtom,
} from '../../../../store/index.ts'

export const tpopRowFromTpop = (tpop) => {
  const fieldsShown = store.get(ekPlanFieldsAtom)

  return tpop ?
      {
        id: tpop.id,
        tpop: tpop,
        apId: tpop?.popByPopId?.apByApId?.id,
        ap: {
          ...fields.ap,
          value: tpop?.popByPopId?.apByApId?.label,
        },
        popNr: {
          ...fields.popNr,
          value: tpop?.popByPopId?.nr ?? '-',
        },
        ...(fieldsShown.includes('popName') ?
          {
            popName: {
              ...fields.popName,
              value: tpop?.popByPopId?.name ?? '-',
            },
          }
        : {}),
        ...(fieldsShown.includes('popStatus') ?
          {
            popStatus: {
              ...fields.popStatus,
              value: tpop?.popByPopId?.popStatusWerteByStatus?.text ?? '-',
            },
          }
        : {}),
        nr: {
          ...fields.nr,
          value: tpop?.nr ?? '-',
        },
        ...(fieldsShown.includes('gemeinde') ?
          {
            gemeinde: {
              ...fields.gemeinde,
              value: tpop?.gemeinde ?? '-',
            },
          }
        : {}),
        ...(fieldsShown.includes('flurname') ?
          {
            flurname: {
              ...fields.flurname,
              value: tpop?.flurname ?? '-',
            },
          }
        : {}),
        ...(fieldsShown.includes('status') ?
          {
            status: {
              ...fields.status,
              value: tpop?.popStatusWerteByStatus?.text ?? '-',
            },
          }
        : {}),
        ...(fieldsShown.includes('bekanntSeit') ?
          {
            bekanntSeit: {
              ...fields.bekanntSeit,
              value: tpop?.bekanntSeit ?? '-',
            },
          }
        : {}),
        ...(fieldsShown.includes('lv95X') ?
          {
            lv95X: {
              ...fields.lv95X,
              value: tpop?.lv95X?.toLocaleString?.('de-ch') ?? '-',
            },
          }
        : {}),
        ...(fieldsShown.includes('lv95Y') ?
          {
            lv95Y: {
              ...fields.lv95Y,
              value: tpop?.lv95Y?.toLocaleString?.('de-ch') ?? '-',
            },
          }
        : {}),
        ...(fieldsShown.includes('link') ?
          {
            link: {
              ...fields.link,
              value: `${appBaseUrl()}Daten/Projekte/${
                tpop.popByPopId.apByApId.projId
              }/Arten/${tpop.popByPopId.apByApId.id}/Populationen/${
                tpop.popByPopId.id
              }/Teil-Populationen/${tpop.id}`,
            },
          }
        : {}),
        ...(fieldsShown.includes('ekfKontrolleur') ?
          {
            ekfKontrolleur: {
              ...fields.ekfKontrolleur,
              value: tpop?.adresseByEkfKontrolleur?.name,
            },
          }
        : {}),
        ...(fieldsShown.includes('ekAbrechnungstyp') ?
          {
            ekAbrechnungstyp: {
              ...fields.ekAbrechnungstyp,
              value:
                tpop?.ekfrequenzByEkfrequenz
                  ?.ekAbrechnungstypWerteByEkAbrechnungstyp?.text ?? '',
            },
          }
        : {}),
        ...(fieldsShown.includes('ekfrequenz') ?
          {
            ekfrequenz: {
              ...fields.ekfrequenz,
              value: tpop?.ekfrequenz ?? null,
            },
          }
        : {}),
        ...(fieldsShown.includes('ekfrequenzStartjahr') ?
          {
            ekfrequenzStartjahr: {
              ...fields.ekfrequenzStartjahr,
              value: tpop?.ekfrequenzStartjahr ?? null,
            },
          }
        : {}),
        ...(fieldsShown.includes('ekfrequenzAbweichend') ?
          {
            ekfrequenzAbweichend: {
              ...fields.ekfrequenzAbweichend,
              value: tpop?.ekfrequenzAbweichend === true,
            },
          }
        : {}),
        yearTitle: fields.yearTitle,
      }
    : {}
}
