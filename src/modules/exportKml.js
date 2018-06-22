// @flow
import fileDownload from 'js-file-download'
import format from 'date-fns/format'
import groupBy from 'lodash/groupBy'

import clean from './removeKmlNogoChar'

export default ({
  fileName,
  data,
}: {
  fileName: string,
  data: Array<Object>,
}) => {
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  const dataByArt = groupBy(data, 'art')
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
      ${
        Object.keys(dataByArt).map(key => `
          <Folder>
            <name>${clean(key)}</name>
            ${
              dataByArt[key].map(
                ({ art, label, inhalte, breitengrad, laengengrad, url }) => `
                  <Placemark>
                    <name>${clean(label)}</name>
                    <description>
                      <![CDATA[
                        ${art}<br><br>
                        ${clean(inhalte)}<br><br>
                        <a href='${url}'>Formular öffnen</a>
                      ]]>
                    </description>
                    <styleUrl>
                      #MyStyle
                    </styleUrl>
                    <Point>
                      <coordinates>
                        ${laengengrad},${breitengrad},0
                      </coordinates>
                    </Point>
                  </Placemark>
                `
              ).join('')
            }
          </Folder>
        `).join('')
      }
    </Document>
    </kml>
  `
  fileDownload(kml, `${file}.kml`, 'application/vnd.google-earth.kmz')
}
