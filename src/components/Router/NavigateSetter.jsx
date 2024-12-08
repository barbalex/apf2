// This is the entry file for the application
import { memo, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../mobxContext.js'

export const NavigateSetter = memo(
  observer(() => {
    const navigate = useNavigate()
    const { navigate: navigateInStore, setNavigate } = useContext(MobxContext)
    const navigateSet = useRef(false)

    useEffect(() => {
      if (navigateInStore) return
      // prevent setting navigate twice
      // only because of strict mode?
      if (navigateSet.current) return

      // console.log('NavigateSetter setting navigate')
      setNavigate(navigate)
      navigateSet.current = true
    }, [navigate, navigateInStore, setNavigate])

    return null
  }),
)
