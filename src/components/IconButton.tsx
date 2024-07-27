import styled from 'styled-components'

const Button = styled.button<{ $hasBorders: boolean }>`
  display: inline-block;
  height: 44px;
  width: 44px;
  border-radius: 22px;
  border: none;
  box-shadow: ${(props) =>
    props.$hasBorders ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'};
  background-color: ${(props) =>
    props.$hasBorders ? 'var(--content-background)' : 'transparent'};
  cursor: pointer;

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

type ButtonType = {
  icon: string
  alt: string
  onClick: () => void
  hasBorders?: boolean
  disabled?: boolean
  style?: any
}

const IconButton = ({
  icon,
  alt,
  onClick,
  hasBorders = true,
  disabled = false,
  style = {},
}: ButtonType) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      $hasBorders={hasBorders}
      style={style}
    >
      <img src={icon} alt={alt} />
    </Button>
  )
}

export default IconButton
