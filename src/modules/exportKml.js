import fileDownload from 'js-file-download'
import format from 'date-fns/format'
import groupBy from 'lodash/groupBy'

import clean from './removeKmlNogoChar'

const exportKml = ({ fileName, data }) => {
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  const dataByArt = groupBy(data, 'art')
  const kml = `<?xml version='1.0' encoding='UTF-8'?>
    <Document>
      <name>${file}</name>
      <Style id='MyStyle'>
        <IconStyle>
          <Icon>
            <href>
              https://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png
            </href>
          </Icon>
        </IconStyle>
      </Style>
      ${Object.keys(dataByArt)
        .map(
          (key) => `
          <Folder>
            <name>${clean(key)}</name>
            ${dataByArt[key]
              .map(
                ({ art, label, inhalte, wgs84Lat, wgs84Long, url }) => `
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
                        ${wgs84Long},${wgs84Lat},0
                      </coordinates>
                    </Point>
                  </Placemark>
                `,
              )
              .join('')}
          </Folder>
        `,
        )
        .join('')}
    </Document>
  `
  fileDownload(kml, `${file}.kml`, 'application/vnd.google-earth.kml+xml')
}

export default exportKml
