import {getAuthorizedPrices} from '../lib/prices.mjs';
export default async function handler(request){
 if(request.method!=='GET')return new Response(JSON.stringify({message:'Method not allowed'}),{status:405,headers:{'Content-Type':'application/json'}});
 try{const quotes=await getAuthorizedPrices();return new Response(JSON.stringify({quotes,requestedAt:new Date().toISOString()}),{status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})}
 catch(err){return new Response(JSON.stringify({message:String(err.message||'ไม่สามารถดึงข้อมูลราคาได้')}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})}
}
