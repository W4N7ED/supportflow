
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ImapFlow } from 'https://esm.sh/imapflow@1.0.142'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer la configuration email
    const { data: config, error: configError } = await supabaseClient
      .from('email_config')
      .select('*')
      .single()

    if (configError || !config) {
      throw new Error('Configuration email non trouvée')
    }

    // Connexion au serveur IMAP
    const client = new ImapFlow({
      host: config.email_server,
      port: 993,
      secure: true,
      auth: {
        user: config.username,
        pass: config.password,
      },
    })

    await client.connect()

    // Sélectionner le dossier
    const lock = await client.getMailboxLock(config.folder)

    try {
      // Rechercher les nouveaux messages
      for await (const message of client.fetch({ unseen: true }, { source: true })) {
        const { from, subject, text, html, messageId, date } = await message.parseEmail()

        // Créer un nouveau ticket
        const { error: ticketError } = await supabaseClient
          .from('tickets')
          .insert({
            title: subject,
            description: text || html,
            priority: 'medium',
            status: 'open',
            email_source: from.address,
            email_conversation_id: messageId,
            last_email_date: date,
          })

        if (ticketError) {
          console.error('Erreur lors de la création du ticket:', ticketError)
        }
      }
    } finally {
      lock.release()
    }

    await client.logout()

    return new Response(
      JSON.stringify({ message: 'Emails vérifiés avec succès' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      },
    )
  }
})
