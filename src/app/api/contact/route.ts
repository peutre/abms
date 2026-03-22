import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation des données
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Le nom, l\'email et le message sont obligatoires.' },
        { status: 400 }
      )
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'L\'adresse email n\'est pas valide.' },
        { status: 400 }
      )
    }

    // Sauvegarde dans la base de données via Payload
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-messages',
      data: {
        name: String(name).trim().slice(0, 200),
        email: String(email).trim().slice(0, 200),
        subject: subject ? String(subject).trim().slice(0, 500) : undefined,
        message: String(message).trim().slice(0, 5000),
        is_read: false,
      },
    })

    // Optionnel : envoyer un email de notification via Resend
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'ABMS Site <noreply@abms06jb.info>',
          to: process.env.CONTACT_EMAIL,
          subject: `Nouveau message de ${name} : ${subject || '(sans sujet)'}`,
          text: `Nouveau message reçu via le site ABMS.\n\nNom : ${name}\nEmail : ${email}\nSujet : ${subject || '—'}\n\nMessage :\n${message}`,
        })
      } catch (emailError) {
        // L'email n'est pas critique — le message est sauvegardé en BDD
        console.error('Erreur envoi email:', emailError)
      }
    }

    return NextResponse.json(
      { message: 'Message envoyé avec succès.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur API contact:', error)
    return NextResponse.json(
      { message: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
