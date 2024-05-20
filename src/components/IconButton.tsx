import styled from 'styled-components'

const Button = styled.button`
  display: inline-block;
  height: 44px;
  width: 44px;
  border-radius: 22px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background-color: var(--content-background);
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
  disabled?: boolean
  style?: any
}

const IconButton = ({
  icon,
  alt,
  onClick,
  disabled = false,
  style = {},
}: ButtonType) => {
  return (
    <Button onClick={onClick} disabled={disabled} style={style}>
      <img src={icon} alt={alt} />
    </Button>
  )
}

export default IconButton
