import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Album photo',
    plural: 'Galerie photos',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Créez des albums photos pour les sorties et activités de l\'association.',
    defaultColumns: ['title', 'date', 'createdAt'],
    group: 'Contenu',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Titre de l\'album',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex: Sortie champignons - Forêt de l\'Estérel, octobre 2025',
      },
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'event',
      label: 'Lier à une sortie',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        description: 'Optionnel : associez cet album à une sortie du calendrier.',
      },
    },
    {
      name: 'cover_photo',
      label: 'Photo de couverture de l\'album',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Cette photo représentera l\'album dans la galerie.',
      },
    },
    {
      name: 'photos',
      label: 'Photos de l\'album',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Glissez-déposez vos photos ou cliquez pour les sélectionner. Les photos sont redimensionnées automatiquement.',
      },
      fields: [
        {
          name: 'photo',
          label: 'Photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Légende',
          type: 'text',
          admin: {
            placeholder: 'Décrivez ce que montre cette photo (optionnel)',
          },
        },
      ],
    },
    {
      name: 'description',
      label: 'Description de l\'album',
      type: 'textarea',
      admin: {
        placeholder: 'Quelques mots pour décrire cet album photo...',
      },
    },
  ],
  timestamps: true,
}
