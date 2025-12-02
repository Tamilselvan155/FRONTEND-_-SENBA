// ============================================
// GOOGLE APPS SCRIPT CODE FOR CONTACT FORM
// ============================================
// 
// INSTRUCTIONS:
// 1. Open your Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Delete ALL existing code
// 4. Paste this ENTIRE file into the editor
// 5. Save the script
// 6. Run the testSheetAccess() function first to verify it works
// 7. Then deploy as Web App
//
// ============================================

function doPost(e) {
  try {
    // Parse the incoming data
    var body = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (this script MUST be bound to the sheet)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get the sheet by name (change 'Sheet1' if your sheet has a different name)
    var sheet = ss.getSheetByName('Sheet1');
    
    // If sheet doesn't exist, try the first sheet
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }
    
    // Append the row with the form data
    sheet.appendRow([
      body.name || 'N/A',
      body.email || 'N/A',
      body.message || 'N/A',
      new Date(),
    ]);
    
    // Return success response
    var result = { success: true, message: 'Data saved successfully' };
    var output = ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
    // CORS headers
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    output.setHeader('Access-Control-Allow-Methods', 'POST');
    
    return output;
    
  } catch (err) {
    // Better error logging
    Logger.log('Error in doPost: ' + err.toString());
    Logger.log('Stack trace: ' + err.stack);
    
    var result = { 
      success: false, 
      error: err.toString(),
      message: err.message || 'Unknown error occurred'
    };
    
    var output = ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    output.setHeader('Access-Control-Allow-Methods', 'POST');
    
    return output;
  }
}

// ============================================
// TEST FUNCTION - Run this first!
// ============================================
function testSheetAccess() {
  try {
    // Get the active spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (!ss) {
      throw new Error('Cannot access spreadsheet. Make sure this script is bound to a sheet.');
    }
    
    // Get the first sheet (or Sheet1 if it exists)
    var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
    
    if (!sheet) {
      throw new Error('No sheets found in the spreadsheet.');
    }
    
    // Try to append a test row
    sheet.appendRow(['TEST', 'test@test.com', 'This is a test message', new Date()]);
    
    Logger.log('✅ SUCCESS! Test row added to sheet: ' + sheet.getName());
    return 'SUCCESS: Test row added successfully!';
    
  } catch (err) {
    Logger.log('❌ ERROR: ' + err.toString());
    Logger.log('Stack: ' + err.stack);
    return 'ERROR: ' + err.toString();
  }
}

// ============================================
// HELPER: Check what sheets exist
// ============================================
function listSheets() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var sheetNames = sheets.map(function(sheet) {
      return sheet.getName();
    });
    
    Logger.log('Available sheets: ' + sheetNames.join(', '));
    return sheetNames;
  } catch (err) {
    Logger.log('Error: ' + err.toString());
    return [];
  }
}

