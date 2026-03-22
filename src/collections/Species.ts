import type { CollectionConfig } from 'payload'

export const Species: CollectionConfig = {
  slug: 'species',
  labels: {
    singular: 'Espèce',
    plural: 'Espèces botaniques et mycologiques',
  },
  admin: {
    useAsTitle: 'name_common',
    description: 'Gérez ici la base d\'espèces de plantes et de champignons observés lors des sorties.',
    defaultColumns: ['name_common', 'name_scientific', 'category', 'edibility'],
    group: 'Contenu',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name_common',
      label: 'Nom commun',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex: Cèpe de Bordeaux',
        description: 'Le nom courant utilisé en français.',
      },
    },
    {
      name: 'name_scientific',
      label: 'Nom scientifique',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex: Boletus edulis',
        description: 'Le nom latin de l\'espèce (en italique sur le site).',
      },
    },
    {
      name: 'slug',
      label: 'Identifiant unique (généré automatiquement)',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Utilisé pour l\'URL de la fiche. Laissez vide pour génération automatique.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name_common) {
              return data.name_common
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: [
        { label: '🌿 Plante', value: 'plante' },
        { label: '🍄 Champignon', value: 'champignon' },
        { label: '🌿 Lichen', value: 'lichen' },
        { label: '🌾 Autre', value: 'autre' },
      ],
    },
    {
      name: 'photo_main',
      label: 'Photo principale',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Photo la plus représentative de l\'espèce. Elle apparaîtra dans la liste.',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'Décrivez l\'espèce : apparence, caractéristiques distinctives, etc.',
      },
    },
    {
      name: 'habitat',
      label: 'Habitat',
      type: 'text',
      admin: {
        placeholder: 'Ex: Sous-bois de chênes et châtaigniers, sols acides',
        description: 'Où peut-on trouver cette espèce ?',
      },
    },
    {
      name: 'season',
      label: 'Saison(s) d\'observation',
      type: 'select',
      hasMany: true,
      options: [
        { label: '🌸 Printemps', value: 'printemps' },
        { label: '☀️ Été', value: 'ete' },
        { label: '🍂 Automne', value: 'automne' },
        { label: '❄️ Hiver', value: 'hiver' },
      ],
      admin: {
        description: 'Sélectionnez une ou plusieurs saisons (cliquez sur chaque saison).',
      },
    },
    {
      name: 'edibility',
      label: 'Comestibilité',
      type: 'select',
      options: [
        { label: '✅ Comestible', value: 'comestible' },
        { label: '⚠️ Non comestible', value: 'non_comestible' },
        { label: '🔶 Toxique', value: 'toxique' },
        { label: '☠️ Mortel', value: 'mortel' },
        { label: '❓ Inconnu', value: 'inconnu' },
      ],
      admin: {
        description: 'IMPORTANT : pour les champignons uniquement. Vérifiez avec soin avant de publier.',
        condition: (data) => data?.category === 'champignon',
      },
    },
    {
      name: 'photos_gallery',
      label: 'Photos supplémentaires',
      type: 'array',
      admin: {
        description: 'Ajoutez d\'autres photos de l\'espèce (différents angles, stades de croissance, etc.).',
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
            placeholder: 'Ex: Vue du dessous du chapeau',
          },
        },
      ],
    },
    {
      name: 'region',
      label: 'Région d\'observation',
      type: 'text',
      admin: {
        placeholder: 'Ex: Alpes-Maritimes, Var',
      },
    },
    {
      name: 'tags',
      label: 'Mots-clés',
      type: 'array',
      admin: {
        description: 'Ajoutez des mots-clés pour faciliter la recherche.',
      },
      fields: [
        {
          name: 'tag',
          label: 'Mot-clé',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}
