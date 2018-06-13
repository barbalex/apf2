// @flow
import axios from 'axios'

const fetchQk = async ({
  berichtjahr,
  apId,
  addMessages,
  errorState,
}: {
  berichtjahr: Number,
  apId: String,
  addMessages: () => void,
  errorState: Object,
}) => {
  const qualityControls = [
    // 3. Teilpopulation
    // TPop ohne verlangten TPop-Bericht im Berichtjahr
    { type: 'function', name: 'qk_tpop_ohne_tpopber', berichtjahr },
    // TPop ohne verlangten TPop-Massn.-Bericht im Berichtjahr
    { type: 'function', name: 'qk_tpop_ohne_massnber', berichtjahr },
    // Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort",
    // bei der eine Massnahme des Typs "Ansiedlung" existiert:
    { type: 'view', name: 'v_qk_tpop_mitstatuspotentiellundmassnansiedlung' },
    // TPop-Bericht ohne Jahr/Entwicklung
    { type: 'view', name: 'v_qk_tpopber_ohnejahr' },
    { type: 'view', name: 'v_qk_tpopber_ohneentwicklung', berichtjahr },

    // 4. Massnahmen

    // Massn ohne Jahr/Typ
    { type: 'view', name: 'v_qk_massn_ohnejahr' },
    { type: 'view', name: 'v_qk_massn_ohnebearb' },
    { type: 'view', name: 'v_qk_massn_ohnetyp', berichtjahr },
    // Massn.-Bericht ohne Jahr/Entwicklung
    { type: 'view', name: 'v_qk_massnber_ohnejahr' },
    { type: 'view', name: 'v_qk_massnber_ohneerfbeurt', berichtjahr },

    // 5. Kontrollen

    // Kontrolle ohne Jahr/Zählung/Kontrolltyp
    { type: 'view', name: 'v_qk_feldkontr_ohnejahr' },
    { type: 'view', name: 'v_qk_freiwkontr_ohnejahr' },
    { type: 'view', name: 'v_qk_feldkontr_ohnebearb' },
    { type: 'view', name: 'v_qk_freiwkontr_ohnebearb' },
    { type: 'view', name: 'v_qk_feldkontr_ohnezaehlung', berichtjahr },
    { type: 'view', name: 'v_qk_freiwkontr_ohnezaehlung', berichtjahr },
    { type: 'view', name: 'v_qk_feldkontr_ohnetyp', berichtjahr },
    // Zählung ohne Einheit/Methode/Anzahl
    { type: 'view', name: 'v_qk_feldkontrzaehlung_ohneeinheit', berichtjahr },
    { type: 'view', name: 'v_qk_freiwkontrzaehlung_ohneeinheit', berichtjahr },
    { type: 'view', name: 'v_qk_feldkontrzaehlung_ohnemethode', berichtjahr },
    { type: 'view', name: 'v_qk_freiwkontrzaehlung_ohnemethode', berichtjahr },
    { type: 'view', name: 'v_qk_feldkontrzaehlung_ohneanzahl', berichtjahr },
    { type: 'view', name: 'v_qk_freiwkontrzaehlung_ohneanzahl', berichtjahr },
  ]
  let nrOfMessages = 0

  const qualityControlsUsingView = qualityControls.filter(
    q => q.type === 'view'
  )
  const queryUrls = qualityControlsUsingView.map(t => {
    if (t.berichtjahr) {
      return `/${t.name}?ap_id=eq.${apId}&Berichtjahr=eq.${t.berichtjahr}`
    } else {
      return `/${t.name}?ap_id=eq.${apId}`
    }
  })
  const dataFetchingPromisesForQueries = queryUrls.map(dataUrl =>
    axios
      .get(dataUrl)
      .then(res => {
        if (res.data.length > 0) {
          const newMessages = res.data
          addMessages(newMessages)
          nrOfMessages += 1
        }
        return null
      })
      .catch(e => e)
  )

  const qualityControlsUsingFunction = qualityControls.filter(
    q => q.type === 'function'
  )
  const functionUrls = qualityControlsUsingFunction.map(t => `/rpc/${t.name}`)
  const dataFetchingPromisesForFunctions = functionUrls.map(dataUrl =>
    axios
      .post(dataUrl, { apid: apId, berichtjahr })
      .then(res => {
        if (res.data.length > 0) {
          const newMessages = res.data
          addMessages(newMessages)
          nrOfMessages += 1
        }
        return null
      })
      .catch(e => e)
  )

  try {
    await Promise.all([
      ...dataFetchingPromisesForQueries,
      ...dataFetchingPromisesForFunctions,
    ])
  } catch (error) {
    errorState.add(error)
  }

  // if no messages: tell user
  if (nrOfMessages === 0) {
    const messages = [
      {
        hw: 'Wow: Scheint alles i.O. zu sein!',
        url: [],
        text: [],
      },
    ]
    addMessages(messages)
  }
  try {
    await axios.post('/rpc/correct_vornach_beginnap_stati', {
      apid: apId,
    })
  } catch (error) {
    errorState.add(error)
  }
}

export default fetchQk
