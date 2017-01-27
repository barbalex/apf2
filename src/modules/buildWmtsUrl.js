/*
 * Bekommt layername und layerConfig
 *
 * Beispiel für layerConfig:
 *
 * var layerConfig = {
 *     attribution: "swisstopo",
 *     format: "jpeg",
 *     serverLayerName: "ch.swisstopo.swissimage",
 *     attributionUrl: "http://www.swisstopo.admin.ch/internet/swisstopo/de/home.html",
 *     topics: "api,luftbilder,swissmaponline",
 *     label: "SWISSIMAGE",
 *     timestamps: [
 *         "20151231",
 *         "20140620",
 *         "20131107",
 *         "20130916",
 *         "20130422",
 *         "20120809",
 *         "20120225",
 *         "20110914",
 *         "20110228"
 *     ],
 *     type: "wmts"
 * }
 *
 * Quelle: http://procrastinatio.org/2015/02/21/lv95-lv03-comparison/
 */

function getMatrixIds (resolutions, pad) {
  var matrixIds = [],
    i
  for (i = 0; i < resolutions.length; i++) {
    if (pad) {
      matrixIds.push((i < 10 ? '0' : '') + i)
    } else {
      matrixIds.push(i)
    }
  }
  return matrixIds
}

var RESOLUTIONS = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1, 0.05]

const buildWmtsUrl = function (layer, options) {
  var resolutions,
    tileGrid,
    extension,
    timestamp,
    attribution,
    localContext,
    tileorder,
    url

  resolutions = options.resolutions ? options.resolutions : RESOLUTIONS
  tileGrid = new ol.tilegrid.WMTS({
    origin: [2420000, 1350000],
    resolutions: resolutions,
    matrixIds: getMatrixIds(resolutions)
  })
  extension = options.format || 'png'
  timestamp = options.timestamps[0]
  if (options.attributionUrl && options.attribution) {
    attribution = new ol.Attribution({
      html: '<a target="new" href="' + options.attributionUrl + '">' + options.attribution + '</a>'
    })
  }
  localContext = {
    'Timestamp': timestamp,
    'MatrixSetId': options.matrixsetid || 21781,
    protocol: window.location.protocol,
    host: options.hosts || 'wmts{5-9}.geo.admin.ch',
    extension: extension

  }
  tileorder = '{TileRow}/{TileCol}'
  if (options.tileorder === 'mapproxy') {
    tileorder = '{TileCol}/{TileRow}'
  }

  url = '[protocol]//[host]/1.0.0/{Layer}/default/[Timestamp]/[MatrixSetId]/' +
    '{TileMatrix}/' + tileorder + '.[extension]'

  // console.log(url)
  url = url.replace(/\[(\w+?)\]/g, function (m, p) { return localContext[p] })
  // console.log(url)
  return url
}

export default buildWmtsUrl
