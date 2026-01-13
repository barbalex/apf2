import { fields } from '../fields.ts'
import { appBaseUrl } from '../../../../modules/appBaseUrl.js'

export const tpopRowFromTpop = ({ tpop, store }) =>
  tpop ?
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
      ...(store.ekPlan.fields.includes('popName') ?
        {
          popName: {
            ...fields.popName,
            value: tpop?.popByPopId?.name ?? '-',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('popStatus') ?
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
      ...(store.ekPlan.fields.includes('gemeinde') ?
        {
          gemeinde: {
            ...fields.gemeinde,
            value: tpop?.gemeinde ?? '-',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('flurname') ?
        {
          flurname: {
            ...fields.flurname,
            value: tpop?.flurname ?? '-',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('status') ?
        {
          status: {
            ...fields.status,
            value: tpop?.popStatusWerteByStatus?.text ?? '-',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('bekanntSeit') ?
        {
          bekanntSeit: {
            ...fields.bekanntSeit,
            value: tpop?.bekanntSeit ?? '-',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('lv95X') ?
        {
          lv95X: {
            ...fields.lv95X,
            value: tpop?.lv95X?.toLocaleString?.('de-ch') ?? '-',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('lv95Y') ?
        {
          lv95Y: {
            ...fields.lv95Y,
            value: tpop?.lv95Y?.toLocaleString?.('de-ch') ?? '-',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('link') ?
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
      ...(store.ekPlan.fields.includes('ekfKontrolleur') ?
        {
          ekfKontrolleur: {
            ...fields.ekfKontrolleur,
            value: tpop?.adresseByEkfKontrolleur?.name,
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('ekAbrechnungstyp') ?
        {
          ekAbrechnungstyp: {
            ...fields.ekAbrechnungstyp,
            value:
              tpop?.ekfrequenzByEkfrequenz
                ?.ekAbrechnungstypWerteByEkAbrechnungstyp?.text ?? '',
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('ekfrequenz') ?
        {
          ekfrequenz: {
            ...fields.ekfrequenz,
            value: tpop?.ekfrequenz ?? null,
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('ekfrequenzStartjahr') ?
        {
          ekfrequenzStartjahr: {
            ...fields.ekfrequenzStartjahr,
            value: tpop?.ekfrequenzStartjahr ?? null,
          },
        }
      : {}),
      ...(store.ekPlan.fields.includes('ekfrequenzAbweichend') ?
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
