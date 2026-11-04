"use strict";
(function(){
  const CONFIG_KEY = "boekhouding-oauth-config-v1";
  const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
  const TAB = "Sheet1";
  const MAX_ROW = 999;
  const money = new Intl.NumberFormat("nl-NL", {style:"currency",currency:"EUR"});
  let config = {clientId:"",sheetId:""};
  let accessToken = "";
  let accessExpires = 0;
  let tokenClient = null;
  let records = [];
  let editing = null;
  let busy = false;

  function el(id){return document.getElementById(id);}
  function say(message, kind){
    el("message").textContent = message;
    el("message").className = "message" + (kind ? " "+kind : "");
  }
  function parseMoney(value){
    if(typeof value === "number") return Number.isFinite(value) ? value : NaN;
    let s = String(value == null ? "" : value).trim().replace(/[€\s\u00a0]/g,"");
    if(!s) return NaN;
    const c=s.lastIndexOf(","), d=s.lastIndexOf(".");
    if(c>=0 && d>=0){
      s = c>d ? s.replace(/\./g,"").replace(",",".") : s.replace(/,/g,"");
    }else if(c>=0){
      s = /^-?\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g,"") : s.replace(",",".");
    }else if(d>=0 && /^-?\d{1,3}(\.\d{3})+$/.test(s)){
      s=s.replace(/\./g,"");
    }
    if(!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
    const n=Number(s);
    return Number.isFinite(n) ? Math.round((n+Math.sign(n)*Number.EPSILON)*100)/100 : NaN;
  }
  function sheetIdFrom(input){
    const s=String(input||"").trim();
    const m=s.match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]{15,})(?:\/|$)/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{15,}$/.test(s) ? s : "");
  }
  function direction(row){
    return (row.from==="Janne" && row.to==="Popke") ? 1 :
           (row.from==="Popke" && row.to==="Janne") ? -1 : 0;
  }
  function rowFromValues(row, rowNumber){
    const a=Array.isArray(row) ? row : [];
    const date=String(a[0]||"").trim();
    const description=String(a[1]||"").trim();
    const from=String(a[2]||"").trim();
    const to=String(a[3]||"").trim();
    const raw=String(a[4] == null ? "" : a[4]).trim();
    const amount=parseMoney(raw);
    if(!date && !description && !from && !to && !raw) return null;
    return {rowNumber, date, description, from, to, amount, raw};
  }
  function sameRow(a,b){
    if(!a || !b) return false;
    const base=["date","description","from","to"];
    if(!base.every(k=>a[k]===b[k]))return false;
    if(Number.isFinite(a.amount) && Number.isFinite(b.amount)) return Math.abs(a.amount-b.amount)<0.001;
    return a.raw===b.raw;
  }
  function displayEntries(){
    let gross=0, net=0, incomplete=0;
    for(const r of records){
      if(Number.isFinite(r.amount)){
        gross+=r.amount;
        const d=direction(r);
        if(d)net+=d*r.amount;
        else incomplete++;
      }else incomplete++;
    }
    el("gross").textContent=money.format(gross);
    el("balance").textContent=money.format(Math.abs(net));
    el("balanceDirection").textContent=net>0.005 ? "Janne → Popke" : net<-.005 ? "Popke → Janne" : "Geen openstaand saldo op ingevulde richtingen";
    el("incomplete").textContent=String(incomplete);
    el("count").textContent="("+records.length+")";
    const q=el("search").value.toLocaleLowerCase("nl").trim();
    const visible=records.filter(r=>[r.date,r.description,r.from,r.to,r.raw].join(" ").toLocaleLowerCase("nl").includes(q)).slice().sort((a,b)=>b.rowNumber-a.rowNumber);
    const container=el("entries");
    container.replaceChildren();
    if(!visible.length){
      const div=document.createElement("div");
      div.className="empty";div.textContent=records.length?"Geen overeenkomende posten.":"Geen posten in het gekoppelde spreadsheet.";
      container.append(div);return;
    }
    for(const r of visible){
      const card=document.createElement("article");card.className="entry";
      const left=document.createElement("div");
      const name=document.createElement("div");name.className="entry-title";
      name.textContent=r.description||"(Geen omschrijving)";
      const meta=document.createElement("div");meta.className="entry-meta";
      const tag=document.createElement("span");tag.className="tag"+(direction(r)?"":" warn");
      tag.textContent=direction(r)?r.from+" → "+r.to:"Richting onbekend";
      const date=document.createElement("span");date.textContent=(r.date||"Geen datum")+" · Rij "+r.rowNumber;
      meta.append(tag,date);left.append(name,meta);
      const right=document.createElement("div");
      const amount=document.createElement("div");amount.className="entry-amount";
      amount.textContent=Number.isFinite(r.amount)?money.format(r.amount):"Ongeldig bedrag";
      const actions=document.createElement("div");actions.className="entry-actions";
      const edit=document.createElement("button");edit.type="button";edit.textContent="Bewerken";
      edit.addEventListener("click",()=>editRecord(r.rowNumber));
      const remove=document.createElement("button");remove.type="button";remove.textContent="Wissen";
      remove.addEventListener("click",()=>removeRecord(r.rowNumber));
      actions.append(edit,remove);right.append(amount,actions);
      card.append(left,right);container.append(card);
    }
  }
  function editorReset(){
    editing=null;el("entryForm").reset();
    el("date").value=new Date().toLocaleDateString("sv-SE");
    el("editorHeading").textContent="Post toevoegen";
    el("saveEntry").textContent="Toevoegen";
    el("cancelEdit").hidden=true;
  }
  function editRecord(row){
    const r=records.find(x=>x.rowNumber===row);if(!r)return;
    editing={...r};
    el("date").value=r.date;el("description").value=r.description;
    el("from").value=["Janne","Popke"].includes(r.from)?r.from:"";
    el("to").value=["Janne","Popke"].includes(r.to)?r.to:"";
    el("amount").value=Number.isFinite(r.amount)?r.amount.toFixed(2).replace(".",","):r.raw;
    el("editorHeading").textContent="Rij "+row+" bewerken";
    el("saveEntry").textContent="Wijzigingen opslaan";el("cancelEdit").hidden=false;
    el("description").focus();el("entryForm").scrollIntoView({block:"start",behavior:"smooth"});
  }
  function setBusy(v){
    busy=v;
    for(const id of ["connect","disconnect","saveConfig","saveEntry","reload"]){el(id).disabled=v;}
  }
  function getConfig(){
    try{const c=JSON.parse(localStorage.getItem(CONFIG_KEY)||"{}");if(c && typeof c==="object")return {clientId:String(c.clientId||""),sheetId:String(c.sheetId||"")};}catch(_e){}
    return {clientId:"",sheetId:""};
  }
  function showConfig(){
    el("clientId").value=config.clientId;el("sheetUrl").value=config.sheetId;
    const valid=!!(config.clientId && config.sheetId);
    el("configState").textContent=valid?"Ingesteld op dit apparaat":"Nog niet ingesteld";
    if(valid)el("setup").open=false;
  }
  function saveConfig(){
    const clientId=el("clientId").value.trim();
    const sheetId=sheetIdFrom(el("sheetUrl").value);
    if(!/^[a-zA-Z0-9._-]+\.apps\.googleusercontent\.com$/.test(clientId)){
      say("De OAuth-client-ID is ongeldig. Maak een Web application-client aan in Google Cloud; gebruik niet de client secret.","error");return;
    }
    if(!sheetId){say("Vul een geldige URL of ID van een Google Spreadsheet in.","error");return;}
    if(!confirm("Heb je bij het spreadsheet Algemene toegang op 'Beperkte toegang' gezet en alleen jullie twee Google-accounts expliciet toegang gegeven? De app kan dit niet zelfstandig controleren."))return;
    config={clientId,sheetId};
    try{localStorage.setItem(CONFIG_KEY,JSON.stringify(config));}
    catch(_e){say("Configuratie kan niet worden opgeslagen in deze browser.","error");return;}
    disconnect(false);
    showConfig();say("Configuratie bewaard op dit apparaat. Log in met Google.");
  }
  async function api(path, options={}){
    if(!accessToken || Date.now()>accessExpires){
      throw Error("Je Google-sessie is verlopen. Log opnieuw in.");
    }
    const base="https://sheets.googleapis.com/v4/spreadsheets/"+encodeURIComponent(config.sheetId)+"/";
    const response=await fetch(base+path,{
      ...options,cache:"no-store",
      headers:{"Authorization":"Bearer "+accessToken,"Content-Type":"application/json",...(options.headers||{})}
    });
    if(!response.ok){
      if(response.status===401){accessToken="";accessExpires=0;throw Error("Google-sessie verlopen. Log opnieuw in.");}
      if(response.status===403)throw Error("Geen toegang tot dit spreadsheet. Controleer of de Sheets API aan staat en het account toegang heeft.");
      if(response.status===404)throw Error("Spreadsheet of tabblad niet gevonden. Controleer de URL en of het tabblad 'Sheet1' heet.");
      let detail="";
      try{const payload=await response.json();detail=String(payload.error?.message||"").slice(0,300);}catch(_e){}
      throw Error("Google Sheets-fout "+response.status+(detail?": "+detail:""));
    }
    if(response.status===204)return {};
    return response.json();
  }
  function rangeValueUrl(range){
    return "values/"+encodeURIComponent("'"+TAB+"'!"+range);
  }
  async function loadData(){
    if(busy)return;
    setBusy(true);say("Bezig met ophalen uit Google Sheets…");
    try{
      const result=await api(rangeValueUrl("C1:G"+MAX_ROW)+"?valueRenderOption=FORMATTED_VALUE");
      const input=result.values||[];
      // Google Sheets may omit trailing blank rows; internal blank rows remain [].
      records=input.map((x,i)=>rowFromValues(x,i+1)).filter(x=>x && x.rowNumber>1);
      el("workspace").hidden=false;
      el("connect").hidden=true;el("disconnect").hidden=false;
      el("authState").textContent="Google verbonden";
      editorReset();displayEntries();
      say(records.length+" posten geladen. Wijzigingen worden rechtstreeks in het spreadsheet opgeslagen.","success");
    }catch(error){
      el("workspace").hidden=true;
      say(error.message,"error");
    }finally{setBusy(false);}
  }
  function connect(){
    if(!config.clientId || !config.sheetId){
      el("setup").open=true;say("Vul eerst de OAuth-client-ID en spreadsheetlink in.","error");return;
    }
    if(!window.google || !window.google.accounts || !window.google.accounts.oauth2){
      say("Google-aanmelding is nog niet geladen of wordt geblokkeerd door je browser. Probeer opnieuw of sta accounts.google.com toe.","error");return;
    }
    try{
      tokenClient=window.google.accounts.oauth2.initTokenClient({
        client_id:config.clientId,scope:SCOPE,
        callback:async response=>{
          if(response.error || !response.access_token){say("Google heeft geen toegang verleend: "+(response.error||"Onbekende fout"),"error");return;}
          accessToken=response.access_token;
          accessExpires=Date.now()+Math.max(1,Number(response.expires_in||3600)-60)*1000;
          await loadData();
        },
        error_callback: error=>say("Google-inloggen is afgebroken of geblokkeerd: "+(error.type||"Onbekende fout"),"error")
      });
      tokenClient.requestAccessToken({prompt:"consent"});
    }catch(error){say("Google OAuth kon niet starten: "+error.message,"error");}
  }
  function disconnect(revoke=true){
    if(revoke && accessToken && window.google?.accounts?.oauth2?.revoke){
      try{window.google.accounts.oauth2.revoke(accessToken,()=>{});}catch(_e){}
    }
    accessToken="";accessExpires=0;tokenClient=null;records=[];
    el("workspace").hidden=true;el("connect").hidden=false;el("disconnect").hidden=true;
    el("authState").textContent="Niet ingelogd";
    editorReset();
    if(revoke)say("Uitgelogd. Geen financiële gegevens blijven in de app beschikbaar.");
  }
  async function currentRow(row){
    const result=await api(rangeValueUrl("C"+row+":G"+row)+"?valueRenderOption=FORMATTED_VALUE");
    return rowFromValues((result.values||[])[0],row);
  }
  async function verifyUnchanged(snapshot){
    const fresh=await currentRow(snapshot.rowNumber);
    if(!sameRow(fresh,snapshot)){
      throw Error("Deze rij is intussen in Google Sheets gewijzigd. Vernieuw de lijst voordat je hem opnieuw bewerkt.");
    }
  }
  async function saveEntry(event){
    event.preventDefault();if(busy)return;
    const date=el("date").value.trim(),description=el("description").value.trim();
    const from=el("from").value,to=el("to").value;
    const amount=parseMoney(el("amount").value);
    if(!description){say("Vul een omschrijving in.","error");return;}
    if(!Number.isFinite(amount)){say("Vul een geldig bedrag in.","error");return;}
    if(from && to && from===to){say("Van en Naar kunnen niet dezelfde persoon zijn.","error");return;}
    const values=[[date,description,from,to,amount]];
    setBusy(true);
    try{
      if(editing){
        await verifyUnchanged(editing);
        const path=rangeValueUrl("C"+editing.rowNumber+":G"+editing.rowNumber)+"?valueInputOption=RAW";
        await api(path,{method:"PUT",body:JSON.stringify({range:"'"+TAB+"'!C"+editing.rowNumber+":G"+editing.rowNumber,majorDimension:"ROWS",values})});
        say("Post bijgewerkt in Google Sheets.","success");
      }else{
        // INSERT_ROWS never overwrites an existing row even if a blank separates two tables.
        const path=rangeValueUrl("C1:G"+MAX_ROW)+":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS";
        await api(path,{method:"POST",body:JSON.stringify({majorDimension:"ROWS",values})});
        say("Nieuwe post toegevoegd aan Google Sheets.","success");
      }
      // Release busy so loadData may fetch the just-written row.
      setBusy(false);await loadData();
    }catch(error){say(error.message,"error");setBusy(false);}
  }
  async function removeRecord(row){
    if(busy)return;
    const record=records.find(x=>x.rowNumber===row);if(!record)return;
    if(!confirm('Rij '+row+' ("'+(record.description||"Geen omschrijving")+'") wissen uit Google Sheets? Dit kan niet ongedaan worden gemaakt.'))return;
    setBusy(true);
    try{
      await verifyUnchanged(record);
      await api(rangeValueUrl("C"+row+":G"+row)+":clear",{method:"POST",body:"{}"});
      setBusy(false);await loadData();
    }catch(error){say(error.message,"error");setBusy(false);}
  }
  function init(){
    config=getConfig();showConfig();editorReset();
    el("saveConfig").addEventListener("click",saveConfig);
    el("connect").addEventListener("click",connect);
    el("disconnect").addEventListener("click",()=>disconnect(true));
    el("entryForm").addEventListener("submit",saveEntry);
    el("cancelEdit").addEventListener("click",editorReset);
    el("search").addEventListener("input",displayEntries);
    el("reload").addEventListener("click",loadData);
    if(config.clientId&&config.sheetId)say("Configuratie gevonden. Log in met Google om de actuele posten te openen.");
  }
  if(typeof module!=="undefined" && module.exports){
    module.exports={parseMoney,sheetIdFrom,rowFromValues,sameRow,direction};
  }
  if(typeof document!=="undefined")init();
})();
