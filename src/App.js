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

  const endpoint = 'http://localhost:3000'

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  }

  const handleChangeFile = async (e) => {
    const { files } = e.target
    const canvas = await loadImage(files[0], { canvas: true })
    canvas.image.toBlob(async (blob) => {
      const metadata = { hogehoge: 'hoge' }

      const jwt = await upload(metadata, blob, endpoint, firebaseConfig)

      setJwt(jwt)
    }, files[0].type)
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
          value={jwt || ''}
          style={{ width: 800 }}
          onChange={(e) => setJwt(e.target.value)}
        />

        <Button
          variant='outlined'
          style={{ width: 150 }}
          onClick={async () => {
            const decoded = await verify(jwt, firebaseConfig)
            setIsValid(!_.isNull(decoded))
          }}>
          JWT検証
        </Button>

        <TextField value={_.isNull(isValid) ? '' : isValid} disabled />

        <Button
          variant='outlined'
          style={{ width: 150 }}
          onClick={async () =>
            setDownloadUrl(await download(jwt, firebaseConfig))
          }>
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
