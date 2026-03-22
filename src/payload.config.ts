import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Events } from './collections/Events'
import { Species } from './collections/Species'
import { Reports } from './collections/Reports'
import { Gallery } from './collections/Gallery'
import { Media } from './collections/Media'
import { ContactMessages } from './collections/ContactMessages'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    theme: 'light',
    meta: {
      titleSuffix: ' — ABMS Administration',
      description: 'Interface d\'administration du site de l\'Association Botanique et Mycologique de la Siagne',
    },
    components: {},
  },

  collections: [
    Users,
    Events,
    Species,
    Reports,
    Gallery,
    Media,
    ContactMessages,
  ],

  // Base de données PostgreSQL (Neon)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  // Stockage photos (Vercel Blob)
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      collections: {
        media: true,
      },
    }),
  ],

  sharp,
  secret: process.env.PAYLOAD_SECRET || 'CHANGEZ-MOI-EN-PRODUCTION',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
})
