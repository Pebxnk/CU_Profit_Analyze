// Copper Profit Analyzer v2.0 — pure calculation functions, prices THB/kg, weights kg.
export const n = x => (x === '' || x === null || x === undefined) ? NaN : Number(x);
export const round = (x, digits=2) => Math.round((x + Number.EPSILON) * 10**digits) / 10**digits;
export function calcLot(lot, sellingPrice=lot.estimatePrice) {
  const items = lot.items || [];
  if (!items.length) throw new Error('เพิ่มสายไฟอย่างน้อย 1 รายการ');
  let weight=0, copper=0, purchase=0;
  for (const it of items) {
    const w=n(it.weight), p=n(it.buyPrice), r=n(it.cuPct);
    if (![w,p,r].every(Number.isFinite) || w<=0 || p<0 || r<=0 || r>100) throw new Error('ตรวจสอบ กก. ราคา และ %Cu ของแต่ละรายการ');
    weight += w; copper += w*r/100; purchase += w*p;
  }
  const c=lot.costs||{};
  const perKg=n(c.stripPerKg??0), labor=n(c.labor??0), transport=n(c.transport??0), other=n(c.other??0);
  if (![perKg,labor,transport,other].every(Number.isFinite) || [perKg,labor,transport,other].some(v=>v<0)) throw new Error('ค่าใช้จ่ายต้องไม่ติดลบ');
  const processing=weight*perKg+labor+transport+other;
  const total=purchase+processing;
  if (!(copper>0) || !(total>0)) throw new Error('น้ำหนักทองแดงและต้นทุนรวมต้องมากกว่าศูนย์');
  const price=n(sellingPrice),validPrice=Number.isFinite(price)&&price>=0;
  const revenue=validPrice?price*copper:null;
  const profit=validPrice?revenue-total:null;
  const target=n(lot.targetROI??0)/100;
  const maxBuy=validPrice?(revenue-processing)/weight:null;
  const maxBuyTarget=validPrice&&Number.isFinite(target)&&target>=0?((revenue/(1+target))-processing)/weight:null;
  return {weight,copper,purchase,processing,total,weightedCu:copper/weight*100,costPerCopperKg:total/copper,
    sellingPrice:validPrice?price:null,revenue,profit,roi:profit===null?null:profit/total*100,breakevenSale:total/copper,
    maxBuy, maxBuyTarget, targetSalePrice:Number.isFinite(target)&&target>=0?total*(1+target)/copper:null, targetROI:Number.isFinite(target)?target*100:null,
    budgetRemaining:Number.isFinite(n(lot.budget))?n(lot.budget)-total:null};
}
export function calcActual(lot) {
  const estimate=calcLot(lot,lot.estimatePrice);
  const sales=lot.sales||[];
  let soldWeight=0,revenue=0;
  for(const s of sales) {
    const w=n(s.weight),p=n(s.price);
    if (![w,p].every(Number.isFinite)||w<=0||p<0) throw new Error('น้ำหนักขายจริงต้องมากกว่า 0 และราคาไม่ติดลบ');
    soldWeight+=w; revenue+=w*p;
  }
  if(!sales.length) return {soldWeight:0,revenue:0,profit:null,roi:null,closed:false};
  const ac=lot.actualCosts||lot.costs;
  const actualBase=calcLot({...lot,costs:ac},lot.estimatePrice);
  const closed=lot.status==='ขายแล้ว';
  return {soldWeight,revenue,actualCost:actualBase.total,profit:closed?revenue-actualBase.total:null,
    roi:closed?(revenue-actualBase.total)/actualBase.total*100:null,closed};
}
export const sumScenario=(lot,price)=>calcLot(lot,price);
export function freshComparable(quotes,grade,days=7,now=Date.now()) {
  return quotes.filter(q=>q.kind==='THAI' && q.grade===grade && q.unit==='THB_KG' && q.vat==='EX_VAT' && q.verified===true &&
    Number.isFinite(n(q.price)) && n(q.price)>0 && Number.isFinite(Date.parse(q.observed)) &&
    Date.parse(q.observed)<=now+60000 && now-Date.parse(q.observed)<=days*86400000);
}
export function priceScenarios(quotes,grade,days=7,now=Date.now()) {
  const matched=freshComparable(quotes,grade,days,now),nums=matched.map(q=>n(q.price)).sort((a,b)=>a-b);
  if(!nums.length)return {count:0,grade};
  return {count:nums.length,grade,low:nums[0],base:nums.reduce((a,b)=>a+b,0)/nums.length,high:nums.at(-1),sources:[...new Set(matched.map(x=>x.source))]};
}
export function safeNumber(x){return Number.isFinite(Number(x))?Number(x):null}
