import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

console.log('PayPal ENV:', {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: PAYPAL_CLIENT_SECRET ? '***' : undefined,
  PAYPAL_API_BASE
});

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!data.access_token) {
    console.error('PayPal token error:', data);
    throw new Error('Failed to get PayPal access token');
  }
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { email, projectName, description, amount, currency = 'USD' } = await req.json();
    console.log('Received invoice request:', { email, projectName, description, amount, currency });
    
    if (!email || !projectName || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    
    // Create a simplified invoice request that complies with PayPal's schema
    const invoicePayload = {
      detail: {
        currency_code: currency,
        note: description || '',
        terms_and_conditions: 'Thank you for choosing OceanTide Co. for your creative project!'
      },
      invoicer: {
        name: { 
          given_name: 'OceanTide', 
          surname: 'Co.' 
        }
      },
      primary_recipients: [
        {
          billing_info: { 
            email_address: email
          }
        }
      ],
      items: [
        {
          name: projectName,
          description: description || '',
          quantity: '1',
          unit_amount: { 
            currency_code: currency, 
            value: amount.toString()
          }
        }
      ]
    };

    console.log('PayPal invoice payload:', JSON.stringify(invoicePayload, null, 2));
    
    // Create the invoice
    const invoiceRes = await fetch(`${PAYPAL_API_BASE}/v2/invoicing/invoices`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(invoicePayload)
    });

    console.log('PayPal invoice creation status:', invoiceRes.status);
    let invoiceData = await invoiceRes.json();
    console.log('PayPal invoice creation response:', invoiceData);

    if (!invoiceRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create invoice in PayPal', 
        details: invoiceData 
      }, { status: invoiceRes.status });
    }

    // If response is a HATEOAS link, fetch the actual invoice details
    if (!invoiceData.id && invoiceData.href) {
      const detailsRes = await fetch(invoiceData.href, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      invoiceData = await detailsRes.json();
      console.log('Fetched invoice details:', invoiceData);
    }

    if (!invoiceData.id) {
      return NextResponse.json({ 
        success: false, 
        error: invoiceData.message || 'Failed to create invoice', 
        details: invoiceData 
      }, { status: 500 });
    }

    // Send the invoice (so it's emailed to the client and appears in your PayPal account)
    console.log('Sending invoice with ID:', invoiceData.id);
    const sendRes = await fetch(`${PAYPAL_API_BASE}/v2/invoicing/invoices/${invoiceData.id}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('PayPal invoice send status:', sendRes.status);
    const sendData = await sendRes.json();
    console.log('PayPal invoice send response:', sendData);

    if (sendRes.status !== 200 && sendRes.status !== 201) {
      console.error('Failed to send invoice:', sendData);
      return NextResponse.json({ 
        success: false, 
        error: 'Invoice created but failed to send', 
        details: sendData 
      }, { status: 500 });
    }

    // Get the invoice details again to ensure we have the latest data
    const finalInvoiceRes = await fetch(`${PAYPAL_API_BASE}/v2/invoicing/invoices/${invoiceData.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });
    
    const finalInvoiceData = await finalInvoiceRes.json();
    console.log('Final invoice data:', finalInvoiceData);

    // Generate the correct invoice URL based on environment
    let invoiceUrl = '';
    if (PAYPAL_API_BASE.includes('sandbox')) {
      // Sandbox URL
      invoiceUrl = `https://www.sandbox.paypal.com/invoice/payerView/details/${invoiceData.id}`;
    } else {
      // Production URL
      invoiceUrl = `https://www.paypal.com/invoice/payerView/details/${invoiceData.id}`;
    }

    // Fallback to PayPal-provided URL if available
    if (finalInvoiceData.metadata?.recipient_view_url) {
      invoiceUrl = finalInvoiceData.metadata.recipient_view_url;
    } else if (finalInvoiceData.links) {
      const payerViewLink = finalInvoiceData.links.find((l: any) => l.rel === 'payer-view');
      if (payerViewLink) {
        invoiceUrl = payerViewLink.href;
      }
    }

    console.log('Generated invoice URL:', invoiceUrl);

    // Return the invoice link and ID for tracking
    return NextResponse.json({
      success: true,
      invoiceUrl: invoiceUrl,
      invoiceId: invoiceData.id,
      status: finalInvoiceData.status,
      message: 'Invoice created and sent successfully from your PayPal account'
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 