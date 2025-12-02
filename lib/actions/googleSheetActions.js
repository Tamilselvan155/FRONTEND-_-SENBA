/**
 * Send enquiry data directly to a Google Sheets Apps Script web app.
 * Only the web app URL is needed – no sheetId is passed from the frontend.
 *
 * We intentionally make this a "simple" CORS request (text/plain)
 * so the browser does NOT send a preflight OPTIONS request,
 * which Apps Script cannot handle (it returns 405).
 */
export const addToGoogleSheet = async (enquiryData) => {
  const webAppUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEB_APP_URL;

  if (!webAppUrl) {
    console.error('NEXT_PUBLIC_GOOGLE_SHEET_WEB_APP_URL is not set in the environment variables.');
    throw new Error('Google Sheet web app URL is not configured.');
  }

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      // text/plain keeps this as a "simple" request (no OPTIONS preflight)
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(enquiryData),
    });

    // If your script returns JSON, parse it; otherwise just return ok flag
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = { ok: response.ok };
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to send data to Google Sheet');
    }

    return data;
  } catch (error) {
    console.error('Failed to send enquiry to Google Sheet:', error);
    throw error;
  }
};

