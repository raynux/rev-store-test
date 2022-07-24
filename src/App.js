import _ from 'lodash'
import { useRef, useState } from 'react'
import loadImage from 'blueimp-load-image'
import { Button, Container, TextField, Stack } from '@mui/material'

import { upload, verify, download } from 'rev-store'

const RevStoreTest = () => {
  const fileRef = useRef()
  const [jwt, setJwt] = useState('')
  const [downloadUrls, setDownloadUrls] = useState('')
  const [isValid, setIsValid] = useState(null)
  const [metadata, setMetadata] = useState([])
  const [files, setFiles] = useState([])
  const [dataUrls, setDataUrls] = useState([])

  const endpoint = process.env.REACT_APP_END_POINT
  const bucketName = process.env.REACT_APP_BUCKET_NAME

  const handleChangeFile = () =>
    _.forEach(fileRef.current.files, (file, i) =>
      loadImage.parseMetaData(file, () =>
        loadImage(
          file,
          (canvas) => {
            setMetadata((prev) => _.concat(prev, { contentType: 'image/jpeg' }))
            setDataUrls((prev) =>
              _.concat(prev, canvas.toDataURL('image/jpeg'))
            )
            setFiles((prev) => _.concat(prev, `hoge_${i}.jpeg`))
          },
          { canvas: true }
        )
      )
    )

  return (
    <Container style={{ marginTop: 100 }}>
      <input
        multiple
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
            画像を選択
          </Button>
        </label>

        {_.map(files, (file) => (
          <div key={file}>{file}</div>
        ))}

        <Button
          disabled={_.isEmpty(dataUrls)}
          variant='outlined'
          component='span'
          style={{ width: 150 }}
          onClick={async () => {
            const jwt = await upload(metadata, files, dataUrls, endpoint)
            setJwt(jwt)
          }}>
          アップロード
        </Button>

        <TextField
          multiline
          maxRows={5}
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

        {_.toString(isValid)}

        <Button
          variant='outlined'
          style={{ width: 150 }}
          onClick={async () =>
            setDownloadUrls(await download(jwt, bucketName, endpoint))
          }>
          ダウンロード
        </Button>

        {_.map(downloadUrls, (url) => (
          <div key={url}>{url}</div>
        ))}
      </Stack>
    </Container>
  )
}

export default RevStoreTest
