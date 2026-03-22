'use client'

import { useState } from 'react'

type FormState = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('sending')
    setErrorMessage('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setFormState('success')
        form.reset()
      } else {
        const error = await response.json()
        setErrorMessage(error.message || 'Une erreur est survenue.')
        setFormState('error')
      }
    } catch {
      setErrorMessage('Impossible d\'envoyer le message. Vérifiez votre connexion et réessayez.')
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div
        className="bg-green-50 border-2 border-green-200 rounded-card p-8 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="text-4xl mb-4" aria-hidden="true">✅</div>
        <h3 className="text-xl font-serif font-semibold text-green-800 mb-3">
          Message envoyé avec succès !
        </h3>
        <p className="text-green-700 text-lg">
          Merci pour votre message. Nous vous répondrons dans les meilleurs délais.
        </p>
        <button
          onClick={() => setFormState('idle')}
          className="btn-secondary mt-6"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Message d'erreur global */}
      {formState === 'error' && (
        <div
          className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-800"
          role="alert"
          aria-live="assertive"
        >
          <strong>Erreur :</strong> {errorMessage}
        </div>
      )}

      {/* Nom */}
      <div>
        <label
          htmlFor="name"
          className="block font-medium text-gray-700 mb-2"
        >
          Votre nom <span className="text-red-600" aria-label="champ obligatoire">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                     focus:border-foret-500 focus:outline-none focus:ring-2 focus:ring-foret-200
                     placeholder:text-gray-400 transition-colors"
          placeholder="Marie Dupont"
          aria-required="true"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block font-medium text-gray-700 mb-2"
        >
          Votre adresse email <span className="text-red-600" aria-label="champ obligatoire">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                     focus:border-foret-500 focus:outline-none focus:ring-2 focus:ring-foret-200
                     placeholder:text-gray-400 transition-colors"
          placeholder="marie.dupont@exemple.fr"
          aria-required="true"
        />
      </div>

      {/* Sujet */}
      <div>
        <label
          htmlFor="subject"
          className="block font-medium text-gray-700 mb-2"
        >
          Sujet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                     focus:border-foret-500 focus:outline-none focus:ring-2 focus:ring-foret-200
                     placeholder:text-gray-400 transition-colors"
          placeholder="Ex: Question sur l'adhésion"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block font-medium text-gray-700 mb-2"
        >
          Votre message <span className="text-red-600" aria-label="champ obligatoire">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                     focus:border-foret-500 focus:outline-none focus:ring-2 focus:ring-foret-200
                     placeholder:text-gray-400 transition-colors resize-y"
          placeholder="Écrivez votre message ici..."
          aria-required="true"
        />
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={formState === 'sending'}
        className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed"
        aria-busy={formState === 'sending'}
      >
        {formState === 'sending' ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Envoi en cours…
          </>
        ) : (
          'Envoyer le message'
        )}
      </button>

      <p className="text-sm text-gray-500">
        Les champs marqués d&apos;un <span className="text-red-600">*</span> sont obligatoires.
      </p>
    </form>
  )
}
