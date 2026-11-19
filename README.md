# Copper Profit Analyzer v2.1 — Netlify Only Edition

เว็บแอป PWA สำหรับซื้อเศษสายไฟหลายชนิดในหนึ่งล็อต คำนวณกำไรคาดการณ์, ROI, จุดคุ้มทุน, บันทึกยอดขายจริงหลายครั้ง, ประวัติใบเสนอราคารายเดือน, คลังความรู้ และ Excel.

**ไม่ใช้ Supabase / Firebase / Cloud Database**. ใช้ IndexedDB ในอุปกรณ์เก็บล็อต/ราคาที่แก้ในแอป และ JSON ที่ GitHub/Netlify เป็นฐานข้อมูลตั้งต้น. ไม่สามารถซิงก์ข้ามอุปกรณ์ได้เอง; ใช้สำรองและกู้คืน JSON แทน.

## Deploy
1. แตก ZIP และ Push ไฟล์ทั้งหมดไปที่ GitHub `Pebxnk/CU_Profit_Analyze` (ระดับ Root)
2. Netlify → Import Git repository → เลือก Repo → Publish directory `public` → Deploy (ไม่ต้องใช้ Build command)
3. เปิด Netlify URL บนมือถือหรือคอมพิวเตอร์
4. สำรอง JSON หลังทำธุรกรรมทุกครั้งในเมนู 'สำรอง / ตั้งค่า'

อ่านคู่มือภาษาไทย `docs/DEPLOY_TH.md`.

## ไฟล์
- `public/index.html`, `app.mjs`, `core.mjs`, `styles.css`, `excel.mjs`: UI และสูตร/Excel
- `public/local-db.mjs`: IndexedDB แบบ Local และนำเข้าข้อมูล localStorage เก่าถ้ามี
- `public/data/cables.json`: 38 ชนิด %Cu จากภาพ (ยังรอตรวจ)
- `public/data/monthly_quote_sample.json`: ราคาเสนอซื้อจากภาพประจำ พ.ย. 2569 (ยังรอตรวจ)
- `netlify/functions/market-feed.mjs` + `netlify/lib/prices.mjs`: API gateway ที่ต้องตั้งผู้ให้บริการที่ได้รับอนุญาต
- `tests/`: ทดสอบสูตรและ Excel

## ความเสี่ยง
- **ข้อมูลที่บันทึกในอุปกรณ์ไม่ใช่ข้อมูล Cloud** ล้างข้อมูลเว็บไซต์แล้วอาจสูญหาย
- JSON ใน `public/data/` เข้าถึงได้สาธารณะบนเว็บที่ไม่ล็อกอิน อย่าใส่ข้อมูลธุรกิจลับหรือใบราคาเฉพาะคู่ค้าที่ห้ามเผยแพร่
- ระบบยังไม่เชื่อมราคาตลาดจริง; การกดอัปเดตเมื่อไม่มี API จะแจ้งข้อผิดพลาดและคงข้อมูลเดิม
- สายไฟและราคา 38 แถวจากภาพหน้า 1/7 ต้องตรวจสอบตัวเลขกับใบเสนอราคาจริง
- ทดสอบบนอุปกรณ์จริงและตรวจสูตรก่อนใช้ตัดสินใจซื้อทุนจำนวนมาก
