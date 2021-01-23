import * as React from 'react'

type RangeButtonProps = {
  onClick?: () => any
  selected?: boolean
}

const RangeButton: React.FC<RangeButtonProps> = ({ onClick, selected, children }) => {
  return (
    <button
      type="button"
      className={`range-buttons ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default RangeButton
