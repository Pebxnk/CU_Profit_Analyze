import {makeWorkbook} from '../public/excel.mjs';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const b=makeWorkbook([['Lots',[['เลขล็อต','น้ำหนัก Cu','กำไร'],['CU-TEST',1000,35000]]],['Items',[['รหัส','สูตรข้อความ'],['A01','=1+1']]]]);
assert.equal(b.type,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
const bytes=Buffer.from(await b.arrayBuffer());assert.equal(bytes.readUInt32LE(0),0x04034b50);assert(bytes.length>1000);
writeFileSync('/tmp/copper_xlsx_test.xlsx',bytes);console.log('PASS XLSX created: '+bytes.length+' bytes');
