import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo',
    plural: 'Photos et médias',
  },
  admin: {
    useAsTitle: 'alt',
    description: 'Toutes les photos uploadées sur le site. Elles sont redimensionnées automatiquement.',
    group: 'Médias',
  },
  access: {
    read: () => true,
  },
  upload: {
    // Redimensionnement automatique des photos
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Description de la photo (texte alternatif)',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex: Cèpe de Bordeaux trouvé lors de la sortie du 15 octobre en forêt de l\'Estérel',
        description: 'IMPORTANT : décrivez précisément ce que montre la photo. Cela aide les personnes malvoyantes.',
      },
    },
    {
      name: 'caption',
      label: 'Légende (optionnel)',
      type: 'text',
      admin: {
        placeholder: 'Texte affiché sous la photo',
      },
    },
  ],
}
