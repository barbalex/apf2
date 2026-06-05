export const layerLegends = ({ apId }) => ({
  ZhLrVegKartierungen: [
    {
      name: 'FnsLRKZH',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=FnsLRKZH&format=image/png&STYLE=default',
    },
    {
      name: 'Übersicht',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=uebersicht&format=image/png&STYLE=default',
    },
    {
      name: 'Wiesen 2012',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=wiesen12&format=image/png&STYLE=default',
    },
    {
      name: 'Trocken 2011',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken11&format=image/png&STYLE=default',
    },
    {
      name: 'Trocken 2001–2010',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken01-10&format=image/png&STYLE=default',
    },
    {
      name: 'Trocken 2000',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken00&format=image/png&STYLE=default',
    },
    {
      name: 'Moore',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=moore&format=image/png&STYLE=default',
    },
    {
      name: 'Feucht 2011',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-11&format=image/png&STYLE=default',
    },
    {
      name: 'Feucht 2001–2010',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-01-10&format=image/png&STYLE=default',
    },
    {
      name: 'Feucht 1981–2000',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-81-00&format=image/png&STYLE=default',
    },
    {
      name: 'Feucht 1971–1980',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-71-80&format=image/png&STYLE=default',
    },
    {
      name: 'Feucht 1961',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-61&format=image/png&STYLE=default',
    },
    {
      name: 'Auen 1993',
      url: 'https://wms.zh.ch/FnsLRKZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=auen-93&format=image/png&STYLE=default',
    },
  ],
  ZhLichteWaelder: [
    {
      name: 'Objekte',
      url: 'https://wms.zh.ch/FnsLWZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=objekte-lichte-waelder-kanton-zuerich&format=image/png&STYLE=default',
    },
  ],
  ZhWaelderVegetation: [
    {
      name: 'Waldgesellschaften',
      url: 'https://wms.zh.ch/FnsLWZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=waldgesellschaften&format=image/png&STYLE=default',
    },
  ],
  ZhForstreviereWms: [
    {
      name: 'Forstreviere',
      url: 'https://wms.zh.ch/WaldEGZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=forstreviere&format=image/png&STYLE=default',
    },
  ],
  ZhSvo: [
    {
      name: 'Objekt Umriss',
      url: 'https://wms.zh.ch/FnsSchutzanordnungenZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=objekt-umriss&format=image/png&STYLE=default',
    },
    {
      name: 'Schutzzonen',
      url: 'https://wms.zh.ch/FnsSchutzanordnungenZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=schutzzonen-farbig&format=image/png&STYLE=default',
    },
    {
      name: 'Zonen nach Schutzkategorien',
      url: 'https://wms.zh.ch/FnsSchutzanordnungenZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-nach-schutzkategorien&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagernde Schutzzonen Naturschutz',
      url: 'https://wms.zh.ch/FnsSchutzanordnungenZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagernde-schutzzonen-naturschutz&format=image/png&STYLE=default',
    },
    {
      name: 'Schutztyp Naturschutz',
      url: 'https://wms.zh.ch/FnsSchutzanordnungenZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=schutztyp-naturschutz&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagernde Schutzzonen',
      url: 'https://wms.zh.ch/FnsSchutzanordnungenZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagernde-schutzzonen&format=image/png&STYLE=default',
    },
  ],
  ZhPflegeplanAJ: [
    {
      name: 'Pflegeplan',
      url: 'https://wms.zh.ch/FnsPflegeajZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=FnsPflegeajZH&format=image/png&STYLE=default',
    },
    {
      name: 'Pflegeplan aktuell',
      url: 'https://wms.zh.ch/FnsPflegeajZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=pfpl-aktuell&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagerung 1 aktuell',
      url: 'https://wms.zh.ch/FnsPflegeajZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagerung1-aktuell&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagerung 2 aktuell',
      url: 'https://wms.zh.ch/FnsPflegeajZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagerung2-aktuell&format=image/png&STYLE=default',
    },
  ],
  ZhPflegeplanVJ: [
    {
      name: 'Pflegeplan',
      url: 'https://wms.zh.ch/FnsPflegevjZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=FnsPflegevjZH&format=image/png&STYLE=default',
    },
  ],
  ZhPflegeplanVVJ: [
    {
      name: 'Pflegeplan',
      url: 'https://wms.zh.ch/FnsPflegevvjZH?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=FnsPflegevvjZH&format=image/png&STYLE=default',
    },
  ],
  MassnahmenFlaechen: [
    {
      name: 'Flächen',
      url: `https://wms.prod.qgiscloud.com/FNS/${apId}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=flaechen&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0`,
    },
  ],
  MassnahmenLinien: [
    {
      name: 'Linien',
      url: `https://wms.prod.qgiscloud.com/FNS/${apId}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=linien&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0`,
    },
  ],
  MassnahmenPunkte: [
    {
      name: 'Punkte',
      url: `https://wms.prod.qgiscloud.com/FNS/${apId}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=punkte&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0`,
    },
  ],
})
