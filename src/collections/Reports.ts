import type { CollectionConfig } from 'payload'

export const Reports: CollectionConfig = {
  slug: 'reports',
  labels: {
    singular: 'Compte rendu',
    plural: 'Comptes rendus',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Rédigez les comptes rendus des sorties avec photos et espèces observées.',
    defaultColumns: ['title', 'date', 'author', 'createdAt'],
    group: 'Contenu',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Titre du compte rendu',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex: Compte rendu - Sortie botanique au Béal, mars 2025',
      },
    },
    {
      name: 'date',
      label: 'Date de la sortie',
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
      label: 'Lier à une sortie du calendrier',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        description: 'Optionnel : associez ce compte rendu à une sortie planifiée.',
      },
    },
    {
      name: 'author',
      label: 'Rédigé par',
      type: 'text',
      admin: {
        placeholder: 'Ex: Jean-Pierre Martin',
      },
    },
    {
      name: 'content',
      label: 'Texte du compte rendu',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Rédigez le compte rendu de la sortie. Vous pouvez mettre en gras, créer des listes, etc.',
      },
    },
    {
      name: 'photos',
      label: 'Photos de la sortie',
      type: 'array',
      admin: {
        description: 'Ajoutez les photos prises lors de cette sortie. Elles seront affichées en galerie.',
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
          label: 'Légende de la photo',
          type: 'text',
          admin: {
            placeholder: 'Ex: Forêt de pins sur le versant nord',
          },
        },
      ],
    },
    {
      name: 'species_seen',
      label: 'Espèces observées lors de cette sortie',
      type: 'relationship',
      relationTo: 'species',
      hasMany: true,
      admin: {
        description: 'Sélectionnez les plantes ou champignons identifiés lors de cette sortie.',
      },
    },
    {
      name: 'is_archived',
      label: 'Archive ancienne (2005-2025)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Cochez si ce compte rendu provient des anciennes archives du site.',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
