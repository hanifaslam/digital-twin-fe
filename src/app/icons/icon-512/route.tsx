import fs from 'fs'
import { ImageResponse } from 'next/og'
import path from 'path'

export const runtime = 'nodejs'

export function GET() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
  const logoData = fs.readFileSync(logoPath)
  const base64Logo = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 56
        }}
      >
        <img
          src={base64Logo}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    ),
    { width: 512, height: 512 }
  )
}
