// Backend contract: one authorized price provider supplies normalized quotes.
// This app does not scrape LME or any buyer's website without permission.
export function cleanQuote(q){
  if(!q||typeof q!=='object')return null;
  const kind=String(q.kind||''),unit=String(q.unit||''),vat=String(q.vat||'NA'),grade=String(q.grade||'').trim(),source=String(q.source||'').trim();
  const lmeType=String(q.lmeType||'');const price=Number(q.price),observed=String(q.observed||'');let url='';
  try{const u=new URL(String(q.url||''));if(u.protocol==='https:')url=u.toString()}catch{}
  if(!source||source.length>200||!url||!Number.isFinite(price)||price<=0||!Number.isFinite(Date.parse(observed))||Date.parse(observed)>Date.now()+60000)return null;
  if(kind==='THAI' && (unit!=='THB_KG'||vat!=='EX_VAT'||!grade))return null;
  if(kind==='LME' && (unit!=='USD_TON'||!['Cash','3-Month'].includes(lmeType)))return null;
  if(kind==='FX' && unit!=='THB_USD')return null;
  if(!['THAI','LME','FX'].includes(kind))return null;
  return {kind,price,unit,vat,grade:kind==='FX'?'USD/THB':kind==='LME'?'Copper':grade,source,url,observed:new Date(observed).toISOString(),lmeType:kind==='LME'?lmeType:'',verified:q.verified===true};
}
export async function getAuthorizedPrices(){
 const endpoint=process.env.PRICE_PROVIDER_URL||'',key=process.env.PRICE_PROVIDER_TOKEN||'';
 if(!/^https:\/\//.test(endpoint))throw new Error('ยังไม่ตั้งค่า PRICE_PROVIDER_URL สำหรับข้อมูลราคาที่ได้รับอนุญาต');
 const controller=new AbortController();const cancel=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch(endpoint,{headers:{'Accept':'application/json',...(key?{'Authorization':'Bearer '+key}:{})},signal:controller.signal});if(!response.ok)throw new Error('ผู้ให้บริการราคาส่ง HTTP '+response.status);const payload=await response.json();if(!Array.isArray(payload.quotes))throw new Error('โครงสร้างราคาต้องมี quotes[]');return payload.quotes.slice(0,300).map(cleanQuote).filter(Boolean)}finally{clearTimeout(cancel)}
}
