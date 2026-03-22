import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'Message',
    plural: 'Messages reçus',
  },
  admin: {
    useAsTitle: 'name',
    description: 'Messages envoyés via le formulaire de contact du site.',
    defaultColumns: ['name', 'subject', 'is_read', 'createdAt'],
    group: 'Administration',
  },
  access: {
    // Les messages ne sont visibles que par les administrateurs
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // le formulaire public peut créer des messages
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      label: 'Nom de l\'expéditeur',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Adresse email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      label: 'Sujet',
      type: 'text',
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'is_read',
      label: 'Lu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Cochez pour marquer ce message comme lu.',
      },
    },
  ],
  timestamps: true,
}
