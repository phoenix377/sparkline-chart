import * as React from 'react'

type RangeButtonProps = {
  onClick?: () => any
  selected?: boolean
  negative?: boolean
}

const RangeButton: React.FC<RangeButtonProps> = ({
  onClick,
  selected,
  children,
  negative = false,
}) => {
  return (
    <button
      type="button"
      className={`range-buttons ${selected ? 'selected' : ''} ${negative ? 'negative' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default RangeButton
