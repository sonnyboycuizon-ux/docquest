// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Method not allowed.',
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase server configuration is missing.')
    }

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured.')
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey
    )

    // Get currently logged-in user
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'You must be logged in.',
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid or expired session.',
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Get profile
    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from('profiles')
        .select('email, email_verified, role')
        .eq('id', user.id)
        .single()

    if (profileError) {
      throw profileError
    }

    if (profile.email_verified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Your email is already verified.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const email = profile.email || user.email

    if (!email) {
      throw new Error('No email address found for this account.')
    }

    // Prevent too many requests.
    const { data: recentCode } = await supabaseAdmin
      .from('email_verification_codes')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (recentCode?.created_at) {
      const lastSent = new Date(recentCode.created_at).getTime()
      const now = Date.now()

      // 60-second cooldown
      if (now - lastSent < 60 * 1000) {
        const remaining = Math.ceil(
          (60 * 1000 - (now - lastSent)) / 1000
        )

        return new Response(
          JSON.stringify({
            success: false,
            message: `Please wait ${remaining} seconds before requesting another code.`,
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }

    // Generate 6-digit verification code
    const code = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    // Code expires after 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    ).toISOString()

    // Delete previous codes
    await supabaseAdmin
      .from('email_verification_codes')
      .delete()
      .eq('user_id', user.id)

    // Save new code
    const { error: insertError } = await supabaseAdmin
      .from('email_verification_codes')
      .insert({
        user_id: user.id,
        email,
        code,
        expires_at: expiresAt,
      })

    if (insertError) {
      throw insertError
    }

    // Send through Brevo
    const brevoResponse = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'DocQuest',
            email: 'sonnyboycurayag829@gmail.com',
          },
          to: [
            {
              email,
            },
          ],
          subject: 'DocQuest Gmail Verification Code',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <h2 style="color:#1a365d;">DocQuest Gmail Verification</h2>

              <p>Hello,</p>

              <p>
                You requested to verify your Gmail account
                for your DocQuest account.
              </p>

              <div style="
                background:#f4f6f8;
                padding:20px;
                text-align:center;
                border-radius:10px;
                margin:20px 0;
              ">
                <div style="font-size:14px;color:#666;">
                  Your verification code is
                </div>

                <div style="
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#1a365d;
                  margin-top:10px;
                ">
                  ${code}
                </div>
              </div>

              <p>
                This verification code will expire in
                <strong>10 minutes</strong>.
              </p>

              <p>
                If you did not request this code, you can safely ignore
                this email.
              </p>

              <p>
                Thank you,<br>
                <strong>DocQuest</strong>
              </p>
            </div>
          `,
        }),
      }
    )

    if (!brevoResponse.ok) {
      const brevoError = await brevoResponse.text()

      console.error('Brevo error:', brevoError)

      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Failed to send the verification email. Please try again.',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Verification code sent to your Gmail successfully.',
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send verification code.',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})