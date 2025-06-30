import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

async function verifySecureHash(
  params: Record<string, any>,
  secretKey: string,
  receivedHash: string
): Promise<boolean> {
  const sortedParams = sortObject(params);
  const signData = Object.keys(sortedParams)
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');

  const crypto = globalThis.crypto;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const dataToSign = encoder.encode(signData);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, dataToSign);
  const calculatedHash = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return calculatedHash === receivedHash;
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());

    console.log('VNPay callback received:', params);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      vnp_ResponseCode,
      vnp_TxnRef,
      vnp_TransactionNo,
      vnp_SecureHash,
      ...otherParams
    } = params;

    // Verify secure hash
    const secretKey = Deno.env.get('VNPAY_HASH_SECRET') || '';
    const isValidHash = await verifySecureHash(
      otherParams,
      secretKey,
      vnp_SecureHash
    );

    if (!isValidHash) {
      console.error('Invalid secure hash');
      return new Response('Invalid secure hash', {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Update transaction status
    const paymentStatus = vnp_ResponseCode === '00' ? 'success' : 'failed';

    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: paymentStatus,
        vnpay_response_code: vnp_ResponseCode,
        vnpay_transaction_no: vnp_TransactionNo,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_ref', vnp_TxnRef);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      throw new Error('Failed to update transaction');
    }

    // If payment successful, upgrade membership
    if (vnp_ResponseCode === '00') {
      // Get user ID from transaction
      const { data: transaction } = await supabase
        .from('payment_transactions')
        .select('user_id')
        .eq('transaction_ref', vnp_TxnRef)
        .single();

      if (transaction) {
        const { error: upgradeError } = await supabase.rpc(
          'upgrade_membership_after_payment',
          {
            p_user_id: transaction.user_id,
            p_transaction_ref: vnp_TxnRef,
            p_membership_type: 'premium',
          }
        );

        if (upgradeError) {
          console.error('Failed to upgrade membership:', upgradeError);
        } else {
          console.log(
            'Membership upgraded successfully for user:',
            transaction.user_id
          );
        }
      }
    }

    // Redirect to frontend with result
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment/result?status=${paymentStatus}&ref=${vnp_TxnRef}`;

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error('Payment callback error:', error);

    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment/result?status=error`;

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: redirectUrl,
      },
    });
  }
});
