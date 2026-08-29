import { createClient } from 'npm:@supabase/supabase-js@2.112.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const authorization = request.headers.get('Authorization')
  const token = authorization?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return jsonResponse({ error: 'Authentication required' }, 401)
  }

  const body = await request.json().catch(() => null) as { confirmation?: string } | null
  if (body?.confirmation !== 'delete-my-account') {
    return jsonResponse({ error: 'Invalid confirmation' }, 400)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: userData, error: userError } = await adminClient.auth.getUser(token)
  if (userError || !userData.user) {
    return jsonResponse({ error: 'Invalid session' }, 401)
  }

  const lastSignInAt = Date.parse(userData.user.last_sign_in_at ?? '')
  if (!Number.isFinite(lastSignInAt) || Date.now() - lastSignInAt > 5 * 60 * 1000) {
    return jsonResponse({ error: 'Recent authentication required' }, 403)
  }

  const userId = userData.user.id
  const { error: anonymizeError } = await adminClient
    .from('posts')
    .update({ author: '탈퇴한 사용자' })
    .eq('author_id', userId)
  if (anonymizeError) {
    console.error('Failed to anonymize posts', anonymizeError)
    return jsonResponse({ error: 'Failed to prepare account deletion' }, 500)
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)
  if (deleteError) {
    console.error('Failed to delete account', deleteError)
    return jsonResponse({ error: 'Failed to delete account' }, 500)
  }

  return jsonResponse({ ok: true }, 200)
})
