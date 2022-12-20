import React from 'react'
import Linkify from 'react-linkify'

// Somehow emotions styles were not applied
// So need to style inline

const Popup = ({ layersData, mapSize = { x: 1000, y: 1000 } }) => {
  // console.log('Popup', { mapSize, x: mapSize.x, y: mapSize.y })

  return (
    <div
      style={{
        overflow: 'auto',
        maxHeight: `${mapSize.y - 40}px`,
        maxWidth: `${mapSize.x - 60}px`,
        marginRight: '-5px',
      }}
    >
      {layersData.map((ld, index) => {
        console.log('Popup, label:', ld.label)
        return (
          <div
            key={ld.label}
            style={{
              marginTop: index === 0 ? 0 : 15,
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: 10 }}>{ld.label}</h4>
            {ld.properties.map(([key, value], index) => (
              <div
                key={`${key}/${index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '85px 1fr',
                  fontSize: 'x-small !important',
                  backgroundColor:
                    index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'white',
                  color: index % 2 === 0 ? 'black' : 'inherit',
                }}
              >
                <div
                  style={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    overflowWrap: 'anywhere',
                  }}
                >{`${key}:`}</div>
                <Linkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a target="blank" href={decoratedHref} key={key}>
                      {decoratedText}
                    </a>
                  )}
                >
                  <div style={{ overflowWrap: 'anywhere' }}>{value}</div>
                </Linkify>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default Popup
