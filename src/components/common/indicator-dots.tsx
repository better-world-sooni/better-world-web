import React from 'react'
import PropTypes from 'prop-types'
import Div from '../Div'

function Dot (props) {
  return (
    <Div spanTag shadow style={{
      display: 'inline-block',
      height: '8px',
      width: '8px',
      borderRadius: '4px',
      backgroundColor: 'white',
      margin: '7px 5px',
      opacity: props.selected ? '1' : '0.3',
      transitionDuration: '300ms',
    }} />
  )
}

export default function IndicatorDots (props) {
  const wrapperStyle = {
    position: 'absolute',
    width: '100%',
    zIndex: '100',
    bottom: '0px',
    textAlign: 'center'
  }

  if (props.total < 2) {
    // Hide dots when there is only one dot.
    return <Div style={wrapperStyle} />
  } else {
    return (
      <Div style={wrapperStyle}>{
        Array.apply(null, Array(props.total)).map((x, i) => {
          return <Dot key={i} selected={props.index === i} />
        })
      }</Div>
    )
  }
}

IndicatorDots.propTypes = {
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}