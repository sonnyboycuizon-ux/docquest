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

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase server configuration is missing.')
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey
    )

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

    const body = await req.json()
    const enteredCode = String(body.code || '').trim()

    if (!/^\d{6}$/.test(enteredCode)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please enter a valid 6-digit verification code.',
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

    // Get latest verification code
    const { data: verificationCode, error: codeError } =
      await supabaseAdmin
        .from('email_verification_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (codeError) {
      throw codeError
    }

    if (!verificationCode) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'No verification code found. Please request a new code.',
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

    // Check expiration
    if (
      new Date(verificationCode.expires_at).getTime() <
      Date.now()
    ) {
      await supabaseAdmin
        .from('email_verification_codes')
        .delete()
        .eq('id', verificationCode.id)

      return new Response(
        JSON.stringify({
          success: false,
          message:
            'This verification code has expired. Please request a new code.',
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

    // Check code
    if (verificationCode.code !== enteredCode) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Incorrect verification code. Please try again.',
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

    // Mark profile as verified
    const { error: updateError } =
      await supabaseAdmin
        .from('profiles')
        .update({
          email_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    // Delete used code
    await supabaseAdmin
      .from('email_verification_codes')
      .delete()
      .eq('id', verificationCode.id)

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Your Gmail account has been verified successfully.',
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
            : 'Failed to verify email.',
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