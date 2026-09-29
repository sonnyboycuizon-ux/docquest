// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':
    'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // ---------------------------------------------------------
  // CORS
  // ---------------------------------------------------------

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Method not allowed.',
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

  try {
    console.log(
      '[update-student] Function started.'
    )

    // -------------------------------------------------------
    // Supabase server configuration
    // -------------------------------------------------------

    const supabaseUrl =
      Deno.env.get('SUPABASE_URL')

    const serviceRoleKey =
      Deno.env.get(
        'SUPABASE_SERVICE_ROLE_KEY'
      )

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        '[update-student] Missing Supabase server configuration.'
      )

      throw new Error(
        'Supabase server configuration is missing.'
      )
    }

    // -------------------------------------------------------
    // Authorization
    // -------------------------------------------------------

    const authHeader =
      req.headers.get('Authorization')

    if (!authHeader) {
      console.error(
        '[update-student] Authorization header is missing.'
      )

      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Authorization header is required.',
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    console.log(
      '[update-student] Authorization header received.'
    )

    // -------------------------------------------------------
    // Supabase admin client
    // -------------------------------------------------------

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      )

    // -------------------------------------------------------
    // Authenticate current user
    // -------------------------------------------------------

    const token =
      authHeader.replace(
        'Bearer ',
        ''
      )

    console.log(
      '[update-student] Verifying session...'
    )

    const {
      data: {
        user: currentUser,
      },
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(
        token
      )

    if (
      userError ||
      !currentUser
    ) {
      console.error(
        '[update-student] Authentication failed:',
        userError
      )

      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Invalid or expired session.',
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    console.log(
      '[update-student] User authenticated:',
      currentUser.id
    )

    // -------------------------------------------------------
    // Verify Super Admin
    // -------------------------------------------------------

    console.log(
      '[update-student] Checking administrator role...'
    )

    const {
      data: currentProfile,
      error:
        currentProfileError,
    } =
      await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq(
          'id',
          currentUser.id
        )
        .single()

    if (
      currentProfileError ||
      !currentProfile
    ) {
      console.error(
        '[update-student] Current profile lookup failed:',
        currentProfileError
      )

      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Unable to verify administrator account.',
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    if (
      currentProfile.role !==
      'super_admin'
    ) {
      console.error(
        '[update-student] User is not Super Admin.'
      )

      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Only Super Admin can edit student accounts.',
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    console.log(
      '[update-student] Super Admin verified.'
    )

    // -------------------------------------------------------
    // Request body
    // -------------------------------------------------------

    const body =
      await req.json()

    const studentId =
      body?.studentId

    const firstName =
      body?.firstName?.trim()

    const lastName =
      body?.lastName?.trim()

    const studentNumber =
      body?.studentNumber?.trim() ||
      ''

    const course =
      body?.course?.trim() ||
      ''

    const phone =
      body?.phone?.trim() ||
      ''

    const studentStatus =
      body?.studentStatus

    console.log(
      '[update-student] Request received for student:',
      studentId
    )

    // -------------------------------------------------------
    // Validation
    // -------------------------------------------------------

    if (!studentId) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Student ID is required.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    if (!firstName) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'First name is required.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    if (!lastName) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Last name is required.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    if (
      studentStatus !== 'student' &&
      studentStatus !== 'graduated'
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Invalid student status.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    // -------------------------------------------------------
    // Find target student
    // -------------------------------------------------------

    console.log(
      '[update-student] Looking up target student...'
    )

    const {
      data: student,
      error:
        studentError,
    } =
      await supabaseAdmin
        .from('profiles')
        .select(
          `
            id,
            first_name,
            middle_initial,
            last_name,
            email,
            student_id,
            course,
            phone,
            student_status,
            suspended,
            email_verified,
            created_at
          `
        )
        .eq(
          'id',
          studentId
        )
        .eq(
          'role',
          'student'
        )
        .single()

    if (
      studentError ||
      !student
    ) {
      console.error(
        '[update-student] Student lookup failed:',
        studentError
      )

      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Student account not found.',
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type':
              'application/json',
          },
        }
      )
    }

    // -------------------------------------------------------
    // Check duplicate Student ID
    // -------------------------------------------------------

    if (studentNumber) {
      console.log(
        '[update-student] Checking Student ID for duplicates...'
      )

      const {
        data:
          existingStudent,
        error:
          duplicateError,
      } =
        await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq(
            'student_id',
            studentNumber
          )
          .neq(
            'id',
            studentId
          )
          .eq(
            'role',
            'student'
          )
          .maybeSingle()

      if (duplicateError) {
        console.error(
          '[update-student] Duplicate check failed:',
          duplicateError
        )

        throw duplicateError
      }

      if (
        existingStudent
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              'Another student account is already using this Student ID.',
          }),
          {
            status: 409,
            headers: {
              ...corsHeaders,
              'Content-Type':
                'application/json',
            },
          }
        )
      }
    }

    // -------------------------------------------------------
    // Update student
    //
    // IMPORTANT:
    // middle_initial is NOT included here.
    //
    // The existing Middle Initial remains unchanged.
    // -------------------------------------------------------

    console.log(
      '[update-student] Updating student information...'
    )

    const {
      data:
        updatedStudent,
      error:
        updateError,
    } =
      await supabaseAdmin
        .from('profiles')
        .update({
          first_name:
            firstName,

          last_name:
            lastName,

          student_id:
            studentNumber ||
            null,

          course:
            course ||
            null,

          phone:
            phone ||
            null,

          student_status:
            studentStatus,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          studentId
        )
        .eq(
          'role',
          'student'
        )
        .select(
          `
            id,
            first_name,
            middle_initial,
            last_name,
            email,
            student_id,
            course,
            phone,
            student_status,
            suspended,
            email_verified,
            created_at,
            updated_at
          `
        )
        .single()

    if (updateError) {
      console.error(
        '[update-student] Update failed:',
        updateError
      )

      throw updateError
    }

    console.log(
      '[update-student] Student updated successfully.'
    )

    // -------------------------------------------------------
    // Success response
    // -------------------------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Student account updated successfully.',
        student:
          updatedStudent,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type':
            'application/json',
        },
      }
    )
  } catch (error) {
    console.error(
      '[update-student] Unexpected error:',
      error
    )

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error?.message ||
          'Failed to update student account.',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type':
            'application/json',
        },
      }
    )
  }
})
