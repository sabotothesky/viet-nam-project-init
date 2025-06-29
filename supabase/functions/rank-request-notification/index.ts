import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { rank_request_id, action } = await req.json()

    if (!rank_request_id || !action) {
      throw new Error('Missing required parameters')
    }

    // Get rank request details
    const { data: rankRequest, error: rankError } = await supabaseClient
      .from('rank_requests')
      .select(`
        *,
        user:user_id(
          id,
          email,
          profiles(full_name, nickname)
        ),
        club:club_id(
          id,
          name,
          address,
          owner_id
        )
      `)
      .eq('id', rank_request_id)
      .single()

    if (rankError || !rankRequest) {
      throw new Error('Rank request not found')
    }

    // Get club owner details
    const { data: clubOwner, error: ownerError } = await supabaseClient
      .from('auth.users')
      .select('email')
      .eq('id', rankRequest.club.owner_id)
      .single()

    if (ownerError || !clubOwner) {
      throw new Error('Club owner not found')
    }

    // Create notification based on action
    let notificationData = {
      user_id: rankRequest.user_id,
      type: 'rank_request_update',
      title: '',
      message: '',
      data: {
        rank_request_id: rankRequest.id,
        action: action,
        club_name: rankRequest.club.name
      }
    }

    switch (action) {
      case 'approved':
        notificationData.title = 'Yêu cầu rank đã được phê duyệt'
        notificationData.message = `Yêu cầu rank ${rankRequest.requested_rank} của bạn tại ${rankRequest.club.name} đã được phê duyệt.`
        break
      
      case 'on_site_test':
        notificationData.title = 'Yêu cầu kiểm tra tại chỗ'
        notificationData.message = `Vui lòng đến ${rankRequest.club.name} tại ${rankRequest.club.address} để kiểm tra trước khi xác nhận rank.`
        break
      
      case 'rejected':
        notificationData.title = 'Yêu cầu rank bị từ chối'
        notificationData.message = `Yêu cầu rank của bạn tại ${rankRequest.club.name} đã bị từ chối.`
        break
      
      case 'banned':
        notificationData.title = 'Tài khoản bị cấm'
        notificationData.message = `Tài khoản của bạn đã bị cấm do gian lận rank.`
        break
      
      default:
        throw new Error('Invalid action')
    }

    // Insert notification
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert(notificationData)

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
    }

    // Send email notification (if email service is configured)
    if (Deno.env.get('SENDGRID_API_KEY')) {
      try {
        const emailData = {
          to: rankRequest.user.email,
          from: 'noreply@sabo-pool.com',
          subject: notificationData.title,
          text: notificationData.message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">${notificationData.title}</h2>
              <p style="color: #666; line-height: 1.6;">${notificationData.message}</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin-top: 0;">Chi tiết yêu cầu:</h3>
                <p><strong>CLB:</strong> ${rankRequest.club.name}</p>
                <p><strong>Rank yêu cầu:</strong> ${rankRequest.requested_rank}</p>
                <p><strong>Ngày tạo:</strong> ${new Date(rankRequest.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                Email này được gửi tự động từ hệ thống SABO Pool Arena Hub.
              </p>
            </div>
          `
        }

        const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        })

        if (!emailResponse.ok) {
          console.error('Error sending email:', await emailResponse.text())
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in rank request notification:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
}) 