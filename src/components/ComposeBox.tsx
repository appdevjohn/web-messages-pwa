/// <reference types="vite-plugin-svgr/client" />

import { useRef, useState } from 'react'
import styled from 'styled-components'

import IconButton from './IconButton'
import FileUploadSVG from '../assets/file-upload.svg?react'
import { GlassmorphicContainer } from './shared/StyledComponents'

const Container = styled(GlassmorphicContainer)<{ $active?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${(props) =>
    props.$active
      ? 'height: 76px'
      : 'calc(76px + env(safe-area-inset-bottom))'};

  @media (min-width: 40rem) {
    height: 96px;
  }
`

const Content = styled.div<{ $uploadEnabled: boolean }>`
  width: calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right));
  display: grid;
  grid-template-columns: ${(props) =>
    props.$uploadEnabled ? '0px 44px 1fr 0px' : '0px 1fr 0px'};
  column-gap: 10px;
  max-width: 40rem;
  margin: auto;
`

const UploadButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

export const ComposeInput = styled.input`
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

  &:focus {
    outline: none;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.75);
    transition: all 0.1s ease-out;
  }

  ::placeholder {
    color: var(--placeholder-text-color);
  }

  @media (prefers-color-scheme: dark) {
    color: black;
  }
`

const FileUploadIcon = styled(FileUploadSVG)`
  path {
    fill: var(--accent-color);
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
      <Content $uploadEnabled={!disableUpload}>
        <div></div>
        <input
          type='file'
          onChange={onUploadFile}
          ref={uploadRef}
          style={{ display: 'none' }}
        />
        {!disableUpload && (
          <UploadButtonContainer>
            <IconButton
              icon={<FileUploadIcon style={{ transform: 'translateY(1px)' }} />}
              disabled={disableUpload}
              onClick={() => {
                uploadRef.current && uploadRef.current.click()
              }}
            />
          </UploadButtonContainer>
        )}
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
