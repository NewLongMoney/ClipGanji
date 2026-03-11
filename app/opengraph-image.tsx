import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ClipGanji'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ color: 'white', fontSize: 130, fontWeight: '700', fontFamily: 'sans-serif' }}>CLIP</div>
          <div style={{ color: '#00C853', fontSize: 130, fontWeight: '700', fontFamily: 'sans-serif' }}>GANJI</div>
        </div>
        <div style={{ color: '#F5B800', fontSize: 45, fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
          Your brand inside every clip.
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
