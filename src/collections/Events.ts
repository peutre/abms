import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Sortie',
    plural: 'Sorties et événements',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Gérez ici le calendrier des sorties botaniques et mycologiques.',
    defaultColumns: ['title', 'date', 'event_type', 'level', 'status'],
    group: 'Calendrier',
  },
  access: {
    read: () => true, // public
  },
  fields: [
    {
      name: 'title',
      label: 'Nom de la sortie',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex: Sortie botanique au Béal',
        description: 'Donnez un nom clair et descriptif à cette sortie.',
      },
    },
    {
      name: 'event_type',
      label: 'Type de sortie',
      type: 'select',
      required: true,
      options: [
        { label: '🌿 Botanique', value: 'botanique' },
        { label: '🍄 Mycologie', value: 'mycologie' },
        { label: '🎓 Initiation', value: 'initiation' },
        { label: '📚 Conférence', value: 'conference' },
        { label: '🤝 Assemblée générale', value: 'assemblee' },
        { label: '🌿🍄 Botanique et Mycologie', value: 'botanique_mycologie' },
      ],
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
        description: 'Sélectionnez la date dans le calendrier.',
      },
    },
    {
      name: 'time_start',
      label: 'Heure de rendez-vous',
      type: 'text',
      admin: {
        placeholder: 'Ex: 9h00',
        description: 'Heure à laquelle les participants doivent se retrouver.',
      },
    },
    {
      name: 'meeting_point',
      label: 'Lieu de rendez-vous',
      type: 'text',
      admin: {
        placeholder: 'Ex: Parking de l\'église de Pégomas',
        description: 'Indiquez le point de départ précis.',
      },
    },
    {
      name: 'level',
      label: 'Niveau requis',
      type: 'select',
      required: true,
      defaultValue: 'tous_niveaux',
      options: [
        { label: '🟢 Débutants', value: 'debutants' },
        { label: '🔵 Perfectionnement', value: 'perfectionnement' },
        { label: '⚪ Tout niveau', value: 'tous_niveaux' },
      ],
    },
    {
      name: 'description',
      label: 'Description et informations pratiques',
      type: 'textarea',
      admin: {
        description: 'Décrivez la sortie : itinéraire, durée, matériel à apporter, etc.',
      },
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      required: true,
      defaultValue: 'planifiee',
      options: [
        { label: '📅 Planifiée', value: 'planifiee' },
        { label: '✅ Confirmée', value: 'confirmee' },
        { label: '❌ Annulée', value: 'annulee' },
        { label: '✔ Terminée', value: 'terminee' },
      ],
      admin: {
        description: 'Mettez à jour ce statut si la sortie est annulée ou terminée.',
      },
    },
  ],
  timestamps: true,
}
