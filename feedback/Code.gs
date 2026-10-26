/**
 * Anonymous "Klopt niet" logger for nogergensnaarbinnen (Google Apps Script).
 * Saves only server timestamp, location ID/name, region and random request ID.
 * No names, accounts, IP addresses or browser fingerprints are collected.
 *
 * One-time activation:
 * 1. Run setup() in the Apps Script editor and approve spreadsheet access.
 * 2. Deploy -> New deployment -> Web app.
 * 3. Execute as: Me. Who has access: Anyone.
 * 4. Place the /exec URL in FEEDBACK_ENDPOINT in index.html.
 */
const SHEET_NAME = 'Meldingen';
const BOOK_TITLE = 'nogergensnaarbinnen - meldingen';
const PROPERTY_NAME = 'FEEDBACK_SPREADSHEET_ID';

function setup() {
  const props=PropertiesService.getScriptProperties();
  let id=props.getProperty(PROPERTY_NAME);
  const book=id?SpreadsheetApp.openById(id):SpreadsheetApp.create(BOOK_TITLE);
  if(!id){props.setProperty(PROPERTY_NAME,book.getId());id=book.getId();}
  let sheet=book.getSheetByName(SHEET_NAME);
  if(!sheet)sheet=book.getSheets()[0].setName(SHEET_NAME);
  if(sheet.getLastRow()===0){
    sheet.appendRow(['Gemeld op (servertijd)','Locatie-ID','Locatie','Regio','Meldings-ID','Status']);
    sheet.setFrozenRows(1);
  }
  Logger.log('Feedbacklogboek: '+book.getUrl());
  return book.getUrl();
}

function plain(value,maxLength) {
  let valueText=String(value||'').slice(0,maxLength).replace(/[\u0000-\u001F\u007F]/g,' ').trim();
  // Prevent interpreting attacker-supplied values as spreadsheet formulas.
  if(/^[=+\-@]/.test(valueText))valueText="'"+valueText;
  return valueText;
}

function doGet(event) {
  const params=(event&&event.parameter)||{};
  const callback=String(params.callback||'');
  // JSONP: the callback name is strictly constrained to prevent script injection.
  if(!/^feedbackAck_[a-f0-9]{32}$/.test(callback)){
    return ContentService.createTextOutput('/* Invalid callback */')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  const request=String(params.request||'');
  const response={ok:false,request};
  try{
    const venueId=String(params.id||'');
    if(!/^[a-z0-9][a-z0-9-]{2,100}$/.test(venueId))throw Error('Invalid venue ID');
    if(!/^[a-f0-9]{32}$/.test(request))throw Error('Invalid request ID');
    const name=plain(params.name,140),region=plain(params.region,100);
    if(!name)throw Error('Missing venue name');
    const lock=LockService.getScriptLock();
    lock.waitLock(25000);
    try{
      const cache=CacheService.getScriptCache();
      const cacheKey='feedback:'+request;
      if(!cache.get(cacheKey)){
        const spreadsheetId=PropertiesService.getScriptProperties().getProperty(PROPERTY_NAME);
        if(!spreadsheetId)throw Error('Run setup() first');
        const sheet=SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_NAME);
        if(!sheet)throw Error('Missing Meldingen tab');
        sheet.appendRow([new Date(),venueId,name,region,request,'Nog controleren']);
        SpreadsheetApp.flush();
        cache.put(cacheKey,'1',21600);
      }
      response.ok=true;
    }finally{
      lock.releaseLock();
    }
  }catch(err){
    console.error('Feedback could not be saved:',String(err));
  }
  return ContentService.createTextOutput(callback+'('+JSON.stringify(response)+');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
