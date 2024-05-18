import { useRef, useState } from 'react'
import styled from 'styled-components'

import fileUpload from '../assets/file-upload.png'

const Container = styled.div<{ $active?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${(props) =>
    props.$active
      ? 'height: 76px'
      : 'calc(76px + env(safe-area-inset-bottom))'};
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
`

const Content = styled.div`
  width: calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right));
  display: grid;
  grid-template-columns: 0px 44px 1fr 0px;
  column-gap: 10px;
`

const UploadButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const UploadButton = styled.button`
  display: inline-block;
  height: 44px;
  width: 44px;
  border-radius: 22px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background-color: var(--content-background);

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const ComposeArea = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 76px;
  margin: auto;
  background-color: transparent;
`

const ComposeInput = styled.input`
  appearance: none;
  border: none;
  height: 44px;
  width: 100%;
  border-radius: 44px;
  background-color: var(--content-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  padding: 0 16px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;

  ::focus {
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    transition: all 0.1s ease-out;
  }

  ::placeholder {
    color: var(--placeholder-text-color);
  }

  @media (prefers-color-scheme: dark) {
    color: black;
  }
`

type ComposeBox = {
  sendMessage: (m: string) => void
  becameActive: () => void
  onUploadFile: () => void
  disableUpload: boolean
}

const ComposeBox = ({
  sendMessage,
  becameActive,
  onUploadFile,
  disableUpload,
}: ComposeBox) => {
  const [message, setMessage] = useState<string>('')
  const [active, setActive] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  return (
    <Container $active={active}>
      <Content>
        <div></div>
        <UploadButtonContainer>
          <UploadButton
            onClick={() => {
              uploadRef.current && uploadRef.current.click()
            }}
            disabled={disableUpload}
          >
            <img src={fileUpload} alt='File Upload' />
          </UploadButton>
          <input
            type='file'
            onChange={onUploadFile}
            ref={uploadRef}
            style={{ display: 'none' }}
          />
        </UploadButtonContainer>
        <ComposeArea>
          <ComposeInput
            type='text'
            placeholder='Message'
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage(message)
                setMessage('')
                inputRef.current && inputRef.current.focus()
              }
            }}
            onFocus={() => {
              setActive(true)
              becameActive()
            }}
            onBlur={() => {
              setActive(false)
            }}
            ref={inputRef}
          />
        </ComposeArea>
        <div></div>
      </Content>
    </Container>
  )
}

export default ComposeBox
