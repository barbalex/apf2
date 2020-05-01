// this version is ogc-compatible and can be used for https://map.geo.admin.ch
import fileDownload from 'js-file-download'
import format from 'date-fns/format'
import groupBy from 'lodash/groupBy'

import clean from './removeKmlNogoChar'

export default ({ fileName, data }) => {
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  const dataByArt = groupBy(data, 'art')
  const kml = `<?xml version='1.0' encoding='UTF-8'?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    ${Object.keys(dataByArt)
      .map(
        (key) => `
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
      `,
      )
      .join('')}
      </kml>
  `
  fileDownload(kml, `${file}.kml`, 'application/vnd.google-earth.kmz')
}
