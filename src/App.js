import _ from 'lodash'
import { useRef, useState } from 'react'
import loadImage from 'blueimp-load-image'
import { Button, Container, TextField, Stack } from '@mui/material'

import { upload, verify, download } from 'rev-store'

const RevStoreTest = () => {
  const fileRef = useRef()
  const [jwt, setJwt] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [isValid, setIsValid] = useState(null)

  const endpoint = process.env.REACT_APP_END_POINT

  const handleChangeFile = () => {
    const file = fileRef.current.files[0]
    loadImage.parseMetaData(file, () => {
      loadImage(
        file,
        async (canvas) => {
          const dataUrl = canvas.toDataURL('image/jpeg')
          const matadata = { contentType: 'image/jpeg' }

          const jwt = await upload(matadata, dataUrl, endpoint)
          setJwt(jwt)
        },
        { canvas: true }
      )
    })
  }

  return (
    <Container style={{ marginTop: 100 }}>
      <input
        accept='image/jpeg'
        style={{ display: 'none' }}
        id='file-input'
        type='file'
        ref={fileRef}
        onChange={handleChangeFile}
      />

      <Stack spacing={2}>
        <label htmlFor='file-input'>
          <Button variant='outlined' component='span' style={{ width: 150 }}>
            アップロード
          </Button>
        </label>
        <TextField
          multiline
          value={jwt}
          style={{ width: 800 }}
          onChange={(e) => setJwt(e.target.value)}
        />

        <Button
          variant='outlined'
          style={{ width: 150 }}
          onClick={async () => {
            const decoded = await verify(jwt, endpoint)
            setIsValid(!_.isNull(decoded))
          }}>
          JWT検証
        </Button>
        <TextField value={_.isNull(isValid) ? '' : isValid} disabled />

        <Button
          variant='outlined'
          style={{ width: 150 }}
          onClick={async () => setDownloadUrl(await download(jwt, endpoint))}>
          ダウンロード
        </Button>
        <TextField
          multiline
          value={downloadUrl || ''}
          style={{ width: 800 }}
          disabled
        />
      </Stack>
    </Container>
  )
}

export default RevStoreTest
