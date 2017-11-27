// @flow
import fileDownload from 'js-file-download'
import format from 'date-fns/format'

import clean from './removeKmlNogoChar'

export default ({
  fileName,
  jsonData,
}: {
  fileName: string,
  jsonData: Array<Object>,
}) => {
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  const kml = `<?xml version='1.0' encoding='UTF-8'?>
  <kml xmlns='http://earth.google.com/kml/2.1'>
    <Document>
      <name>${file}</name>
      <Style id='MyStyle'>
        <IconStyle>
          <Icon>
            <href>
              http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png
            </href>
          </Icon>
        </IconStyle>
      </Style>
      ${jsonData.map(
        ({ Art, Label, Inhalte, Breitengrad, Laengengrad, url }) => `
        <Folder>
          <name>${clean(Art)}</name>
          <Placemark>
            <name>${clean(Label)}</name>
            <description>
              <![CDATA[
                ${Art}<br><br>
                ${clean(Inhalte)}<br><br>
                <a href='${url}'>Formular öffnen</a>
              ]]>
            </description>
            <styleUrl>
              #MyStyle
            </styleUrl>
            <Point>
              <coordinates>
                ${Laengengrad},${Breitengrad},0
              </coordinates>
            </Point>
          </Placemark>
        </Folder>
      `
      )}
    </Document>
    </kml>
  `
  fileDownload(kml, `${file}.kml`)
}
