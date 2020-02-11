import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import padding from './padding'

import i001 from './6c52d1ab-4f62-11e7-aebe-0bac47bfd0e2.png'
import i002 from './6c52d1c5-4f62-11e7-aebe-0ba4179b00ef.png'
import i003 from './6c52d1d2-4f62-11e7-aebe-0f4a6fd6302d.png'
import i004 from './6c52d1d5-4f62-11e7-aebe-efe7798714be.png'
import i005 from './6c52d1d6-4f62-11e7-aebe-ff9a1728b3c2.png'
import i006 from './6c52d1e6-4f62-11e7-aebe-d365c4f34069.png'
import i007 from './6c52d1f6-4f62-11e7-aebe-dfe3eaf910cc.png'
import i008 from './6c52d1fb-4f62-11e7-aebe-1f005b242e3b.png'
import i009 from './6c52d1fd-4f62-11e7-aebe-eb8372f65d89.png'
import i010 from './6c52d1ff-4f62-11e7-aebe-ebb98d6fc3cd.png'
import i011 from './6c52d2aa-4f62-11e7-aebe-07d8f7f7a15f.png'
import i012 from './6c52d2c5-4f62-11e7-aebe-1bae8687d749.png'
import i013 from './6c52d2e6-4f62-11e7-aebe-7f6df0551226.png'
import i014 from './6c52d2e9-4f62-11e7-aebe-333ee57f5b45.png'
import i015 from './6c52d2f0-4f62-11e7-aebe-138e69662b58.png'
import i016 from './6c52d2f1-4f62-11e7-aebe-c357c17496bc.png'
import i017 from './6c52d2fa-4f62-11e7-aebe-631cf4b57c2b.png'
import i018 from './6c52d2ff-4f62-11e7-aebe-dfaa30dbe005.png'
import i019 from './6c52d14b-4f62-11e7-aebe-13080d6c3ca2.png'
import i021 from './6c52d15d-4f62-11e7-aebe-d3ebe63c98ce.png'
import i022 from './6c52d16c-4f62-11e7-aebe-bf479a922be9.png'
import i023 from './6c52d17a-4f62-11e7-aebe-735510824f5c.png'
import i024 from './6c52d17c-4f62-11e7-aebe-1fc9d4d8081b.png'
import i025 from './6c52d24a-4f62-11e7-aebe-3b1fea21f435.png'
import i026 from './6c52d25d-4f62-11e7-aebe-4719a1363629.png'
import i027 from './6c52d28b-4f62-11e7-aebe-1772be4a5746.png'
import i028 from './6c52d28e-4f62-11e7-aebe-7f7763f755a8.png'
import i029 from './6c52d28f-4f62-11e7-aebe-af6c305c3118.png'
import i031 from './6c52d29a-4f62-11e7-aebe-df2a375e3003.png'
import i032 from './6c52d30b-4f62-11e7-aebe-73528305a058.png'
import i033 from './6c52d30c-4f62-11e7-aebe-2fdf30155710.png'
import i034 from './6c52d31a-4f62-11e7-aebe-774437534c00.png'
import i035 from './6c52d33a-4f62-11e7-aebe-c362ab7bf00c.png'
import i036 from './6c52d126-4f62-11e7-aebe-cbb8319e1712.png'
import i037 from './6c52d134-4f62-11e7-aebe-f78ab946ed4e.png'
import i038 from './6c52d142-4f62-11e7-aebe-13d6fdd1c0e7.png'
import i039 from './6c52d173-4f62-11e7-aebe-2bd3a2ea4576.png'
import i041 from './6c52d174-4f62-11e7-aebe-67a303eb0640.png'
import i042 from './6c52d200-4f62-11e7-aebe-334a20278a47.png'
import i043 from './6c52d223-4f62-11e7-aebe-e3ef9e657ec9.png'
import i044 from './6c52d225-4f62-11e7-aebe-b3e2d7efa4b5.png'
import i045 from './6c52d245-4f62-11e7-aebe-0319a140fe46.png'
import i046 from './6c52d250-4f62-11e7-aebe-a71b014ac715.png'
import i047 from './6c52d290-4f62-11e7-aebe-4b95be9a1ab4.png'
import i048 from './6c52d296-4f62-11e7-aebe-c7938476c206.png'
import i049 from './6c52d300-4f62-11e7-aebe-37a15e739517.png'
import i050 from './6c52d335-4f62-11e7-aebe-5325f98ff13e.png'
import i051 from './6c52d347-4f62-11e7-aebe-8b160a649947.png'

const iObject = {
  '6c52d1ab-4f62-11e7-aebe-0bac47bfd0e2': i001,
  '6c52d1c5-4f62-11e7-aebe-0ba4179b00ef': i002,
  '6c52d1d2-4f62-11e7-aebe-0f4a6fd6302d': i003,
  '6c52d1d5-4f62-11e7-aebe-efe7798714be': i004,
  '6c52d1d6-4f62-11e7-aebe-ff9a1728b3c2': i005,
  '6c52d1e6-4f62-11e7-aebe-d365c4f34069': i006,
  '6c52d1f6-4f62-11e7-aebe-dfe3eaf910cc': i007,
  '6c52d1fb-4f62-11e7-aebe-1f005b242e3b': i008,
  '6c52d1fd-4f62-11e7-aebe-eb8372f65d89': i009,
  '6c52d1ff-4f62-11e7-aebe-ebb98d6fc3cd': i010,
  '6c52d2aa-4f62-11e7-aebe-07d8f7f7a15f': i011,
  '6c52d2c5-4f62-11e7-aebe-1bae8687d749': i012,
  '6c52d2e6-4f62-11e7-aebe-7f6df0551226': i013,
  '6c52d2e9-4f62-11e7-aebe-333ee57f5b45': i014,
  '6c52d2f0-4f62-11e7-aebe-138e69662b58': i015,
  '6c52d2f1-4f62-11e7-aebe-c357c17496bc': i016,
  '6c52d2fa-4f62-11e7-aebe-631cf4b57c2b': i017,
  '6c52d2ff-4f62-11e7-aebe-dfaa30dbe005': i018,
  '6c52d14b-4f62-11e7-aebe-13080d6c3ca2': i019,
  '6c52d15d-4f62-11e7-aebe-d3ebe63c98ce': i021,
  '6c52d16c-4f62-11e7-aebe-bf479a922be9': i022,
  '6c52d17a-4f62-11e7-aebe-735510824f5c': i023,
  '6c52d17c-4f62-11e7-aebe-1fc9d4d8081b': i024,
  '6c52d24a-4f62-11e7-aebe-3b1fea21f435': i025,
  '6c52d25d-4f62-11e7-aebe-4719a1363629': i026,
  '6c52d28b-4f62-11e7-aebe-1772be4a5746': i027,
  '6c52d28e-4f62-11e7-aebe-7f7763f755a8': i028,
  '6c52d28f-4f62-11e7-aebe-af6c305c3118': i029,
  '6c52d29a-4f62-11e7-aebe-df2a375e3003': i031,
  '6c52d30b-4f62-11e7-aebe-73528305a058': i032,
  '6c52d30c-4f62-11e7-aebe-2fdf30155710': i033,
  '6c52d31a-4f62-11e7-aebe-774437534c00': i034,
  '6c52d33a-4f62-11e7-aebe-c362ab7bf00c': i035,
  '6c52d126-4f62-11e7-aebe-cbb8319e1712': i036,
  '6c52d134-4f62-11e7-aebe-f78ab946ed4e': i037,
  '6c52d142-4f62-11e7-aebe-13d6fdd1c0e7': i038,
  '6c52d173-4f62-11e7-aebe-2bd3a2ea4576': i039,
  '6c52d174-4f62-11e7-aebe-67a303eb0640': i041,
  '6c52d200-4f62-11e7-aebe-334a20278a47': i042,
  '6c52d223-4f62-11e7-aebe-e3ef9e657ec9': i043,
  '6c52d225-4f62-11e7-aebe-b3e2d7efa4b5': i044,
  '6c52d245-4f62-11e7-aebe-0319a140fe46': i045,
  '6c52d250-4f62-11e7-aebe-a71b014ac715': i046,
  '6c52d290-4f62-11e7-aebe-4b95be9a1ab4': i047,
  '6c52d296-4f62-11e7-aebe-c7938476c206': i048,
  '6c52d300-4f62-11e7-aebe-37a15e739517': i049,
  '6c52d335-4f62-11e7-aebe-5325f98ff13e': i050,
  '6c52d347-4f62-11e7-aebe-8b160a649947': i051,
}

/**
 * see https://stackoverflow.com/a/21160150/712005 to force printing background image
 */

const Container = styled.div`
  grid-area: image;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 20fr;
  grid-template-areas:
    'title'
    'myImage';
  @media print {
    -webkit-print-color-adjust: exact;
  }
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  justify-self: center;
`
// https://www.voorhoede.nl/en/blog/say-no-to-image-reflow/
const ImageContainer = styled.div`
  grid-area: myImage;
  background-image: ${props => `url("${props.src}") !important`};
  background-origin: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: ${props => (props.padding ? props.padding : 85)}%;
`
const NotifContainer = styled.div`
  grid-area: myImage;
  display: flex;
  justify-content: center;
  align-items: center;
`

/*const fetchImageIfNeeded = async ({
  image,
  setImage,
  setNotif,
  apId,
  artname,
}) => {
  if (!image && !!apId) {
    let newImage
    try {
      newImage = await import(`./${apId}.png`) //.then(m => m.default)
    } catch (error) {
      console.log('Image not loaded, error:', error)
      return setNotif(`Für ${artname} wurde kein Bild gefunden`)
    }
    if (newImage && newImage.default) setImage(newImage.default)
  }
}*/

const Image = ({ artname, apId }) => {
  /*const [image, setImage] = useState(null)
  const [notif, setNotif] = useState(null)

  useEffect(() => {
    setImage(null)
    setNotif(null)
  }, [apId])

  useEffect(() => {
    console.log('Image, fetching image for:', artname)
    fetchImageIfNeeded({ apId, artname, image, setImage, setNotif })
  }, [apId, artname, image])
  console.log('Image', { image, artname })*/

  const image = iObject[apId]

  console.log('Image', { image, i001 })

  return (
    <Container>
      <Title>{artname}</Title>
      {image ? (
        <ImageContainer src={image} padding={padding[apId]} />
      ) : (
        <NotifContainer>{`Für ${artname} wurde kein Bild gefunden`}</NotifContainer>
      )}
    </Container>
  )
}

export default Image
