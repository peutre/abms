import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Administrateur',
    plural: 'Administrateurs',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    description: 'Comptes administrateurs du site.',
  },
  auth: true, // active l'authentification pour cette collection
  fields: [
    {
      name: 'name',
      label: 'Nom',
      type: 'text',
    },
  ],
}
