import React from 'react'
import propTypes from 'prop-types'
import Div from '../Div'

const styles = {
  wrapper: {
    position: 'absolute',
    width: '100%',
    zIndex: '100',
    bottom: '0',
    textAlign: 'center'
  },
  btn: {
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'absolute',
    bottom: '0',
    font: '16px/30px sans-serif',
    color: 'rgba(255,255,255,0.8)'
  },
  left: {
    left: '0'
  },
  right: {
    right: '0'
  }
}

export default function IndicatorButtons (props) {
  const prevBtnStyle = Object.assign({}, styles.btn, styles.left)
  const nextBtnStyle = Object.assign({}, styles.btn, styles.right)
  const { index, total, loop, prevHandler, nextHandler } = props
  return (
    <Div style={styles.wrapper}>
      { (loop || index !== 0) && (
        <Div shadow style={prevBtnStyle} onClick={prevHandler}>◀</Div>
      )}
      { (loop || index !== total - 1) && (
        <Div shadow style={nextBtnStyle} onClick={nextHandler}>▶</Div>
      )}
    </Div>
  )
}

IndicatorButtons.propTypes = {
  index: propTypes.number.isRequired,
  total: propTypes.number.isRequired,
  prevHandler: propTypes.func,
  nextHandler: propTypes.func
}