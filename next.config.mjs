import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default withPayload(nextConfig, {
  configPath: path.resolve(__dirname, './src/payload.config.ts'),
})
