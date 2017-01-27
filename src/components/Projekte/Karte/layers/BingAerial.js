    import React from 'react'
    import { BingLayer } from 'react-leaflet-bing'

    const bingKey = `AjGOtB_ygBplpxXtKiiHtm-GERjSg9TFEoCmuBI_Yz4VWy0unRGUDo9GOZHA46Pf`

    const BingAerialLayer = () =>
      <BingLayer
        bingkey={bingKey}
      />

    export default BingAerialLayer
