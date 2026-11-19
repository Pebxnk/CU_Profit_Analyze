# คู่มือ Deploy Copper Profit Analyzer v2.1 — Netlify Only

## 1) ขั้นตอนขึ้นออนไลน์ (ไม่ต้องต่อฐานข้อมูล)
1. ดาวน์โหลด ZIP แล้วแตกไฟล์
2. สร้างหรือเปิด Repository `Pebxnk/CU_Profit_Analyze` บน GitHub
3. อัปโหลด **ไฟล์ด้านใน ZIP ทั้งหมด** ที่ราก Repository เช่น `public/`, `netlify/`, `netlify.toml`, `README.md` (อย่าอัปโหลด ZIP ก้อนเดียว)
4. ไป Netlify → Add new project → Import from GitHub → เลือก Repository
5. Build command: **เว้นว่าง**; Publish directory: `public`; Functions directory: `netlify/functions` (อยู่ใน netlify.toml แล้ว)
6. กด Deploy; เปิด URL ของ Netlify แล้วใช้งานจากมือถือหรือคอมพิวเตอร์
7. Push การแก้ไข GitHub ครั้งต่อไปเพื่อ Deploy แอปเวอร์ชันใหม่

## 2) ข้อมูลเก็บที่ไหน
- `public/data/cables.json`: สายไฟตั้งต้น 38 ชนิดจากภาพ 1/7 (ยังรอตรวจ)
- `public/data/monthly_quote_sample.json`: ตัวอย่างใบเสนอราคาประจำเดือน พ.ย. 2569 (ยังรอตรวจ)
- รายการเพิ่ม/แก้ไขผ่านหน้าแอป รวมถึงล็อตและราคาขายจริง: **IndexedDB ในเบราว์เซอร์ของเครื่องนั้น**
- หากแก้ใบเสนอราคาในแอป จะไม่แก้ไฟล์ JSON บน GitHub; ถ้าต้องการกระจายราคาเริ่มต้นทุกเครื่องให้แก้ JSON ใน Repository แล้ว Deploy ใหม่
- การ Deploy ไม่ลบ IndexedDB ของเครื่องเดิม ถ้ายังอยู่ใน Origin เดียวกันและไม่ได้ล้างข้อมูลเว็บไซต์
- ถ้าเปลี่ยนเครื่องหรือเปิดบนเบราว์เซอร์อื่น: ไปเมนู **สำรอง / ตั้งค่า → สำรอง JSON** บนอุปกรณ์เดิม แล้ว **กู้คืนจาก JSON** บนอุปกรณ์ใหม่
- กู้คืน JSON จะ **เขียนทับข้อมูลในเครื่องปลายทาง** ไม่ใช่การรวมรายการ และต้องสำรองของเดิมก่อน

## 3) ราคาทองแดงออนไลน์
- ปุ่ม 'อัปเดตราคา' เรียก `/.netlify/functions/market-feed`
- ถ้ามีผู้ให้บริการ API ที่ได้รับอนุญาต จึงตั้งตัวแปร `PRICE_PROVIDER_URL` และ `PRICE_PROVIDER_TOKEN` (ถ้ามี) ใน Environment Variables ของ Netlify แล้ว Deploy ใหม่
- API ต้องส่ง JSON `{ "quotes": [ ... ] }` ตาม `docs/PRICE_PROVIDER_CONTRACT.json`
- ก่อนตั้ง API แสดงแจ้งข้อผิดพลาดตามจริง ไม่สร้างราคาปัจจุบันขึ้นเอง; ราคาเก่าที่บันทึกไว้ยังอยู่
- ไม่ใช้ LME เป็นราคารับซื้อเศษทองแดงโดยตรง

## 4) สำรองข้อมูล / ความเป็นส่วนตัว
- IndexedDB ไม่ใช่ Cloud และไม่ซิงก์ข้ามอุปกรณ์
- ควรดาวน์โหลด JSON และ Excel ทุกครั้งหลังบันทึกล็อตหรือขายทองแดงจริง
- ไฟล์สำรองมีข้อมูลต้นทุนและคู่ค้า เก็บไว้ในพื้นที่ส่วนตัว ไม่ Commit ลง GitHub สาธารณะ
- หากล้าง Browser data หรือใช้ Incognito ข้อมูลอาจสูญหาย
- หากมีผู้ใช้หลายคนใช้เครื่องเดียวกัน ควรแยกโปรไฟล์เบราว์เซอร์/อุปกรณ์

## 5) ทดสอบ
รัน `node tests/core.test.mjs` และ `node tests/xlsx.test.mjs` (ต้องมี Node.js) เปิดผ่าน Netlify URL เพื่อทดสอบ IndexedDB จริง
