import './App.css'
import * as jose from 'jose'

import { useState, useEffect } from 'react'

// import.meta.env variables come from .env file
const METABASE_SITE_URL = import.meta.env.VITE_METABASE_SITE_URL
const METABASE_SECRET_KEY = import.meta.env.VITE_METABASE_SECRET_KEY
const RESOURCE = {}
RESOURCE[import.meta.env.VITE_RESOURCE_TYPE] = Number.parseInt(import.meta.env.VITE_RESOURCE_ID)

const createToken = async (resource) => {
	const payload = {
		resource,
		params: {}
	};

  const secret = new TextEncoder().encode(METABASE_SECRET_KEY)

  const alg = 'HS256'

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(secret)

  return token
}

const createIframeUrl = async resource => {
  const token = await createToken(resource)

  const resourceType = Object.keys(resource)[0]

  return `${METABASE_SITE_URL}/embed/${resourceType}/${token}#bordered=true&titled=true`
}

const App = () => {
  const [iframeUrl, setIframeUrl] = useState('')

  useEffect(() => {
    createIframeUrl(RESOURCE)
      .then(url => {
        setIframeUrl(url)
      })
  })

  return (
    <>
      <h1>Metabase signed embedding</h1>
      <div>
        <iframe
          src={iframeUrl}
          title="Metabase signed embedding"
          frameBorder="0"
          width="800"
          height="600"
          // allowTransparency="true"
        ></iframe>
      </div>
    </>
  )
}

export default App
