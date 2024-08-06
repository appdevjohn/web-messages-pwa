import styled from 'styled-components'

const Button = styled.button<{
  $hasBorders: boolean
  $backgroundColor?: string
}>`
  display: inline-block;
  height: 44px;
  width: 44px;
  border-radius: 22px;
  border: none;
  box-shadow: ${(props) =>
    props.$hasBorders ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'};
  background-color: ${(props) =>
    props.$hasBorders
      ? props.$backgroundColor || 'var(--content-background)'
      : 'transparent'};
  cursor: pointer;

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

type ButtonType = {
  icon: any
  onClick: () => void
  hasBorders?: boolean
  backgroundColor?: string
  disabled?: boolean
  style?: any
  fill?: string
}

const IconButton = ({
  icon,
  onClick,
  hasBorders = true,
  backgroundColor,
  disabled = false,
  style = {},
}: ButtonType) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      $hasBorders={hasBorders}
      $backgroundColor={backgroundColor}
      style={style}
    >
      {icon}
    </Button>
  )
}

export default IconButton
