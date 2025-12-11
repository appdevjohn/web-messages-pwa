import styled from 'styled-components'

const Button = styled.button<{
  $hasBorders: boolean
  $backgroundColor?: string
}>`
  display: inline-block;
  height: 44px;
  width: 44px;
  border-radius: 12px;
  border: none;
  box-shadow: ${(props) =>
    props.$hasBorders ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  background-color: ${(props) =>
    props.$hasBorders
      ? props.$backgroundColor || 'var(--content-background)'
      : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$hasBorders ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: ${(props) =>
      props.$hasBorders ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'};

    &:hover:not(:disabled) {
      box-shadow: ${(props) =>
        props.$hasBorders ? '0 4px 12px rgba(0, 0, 0, 0.4)' : 'none'};
    }
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
