import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const pixScript = fs.readFileSync(path.join(projectRoot, 'js', 'pix.js'), 'utf8');

const context = {
  console,
  String,
  Number,
  Boolean,
  RegExp,
  Array,
  Object,
  Math,
  navigator: { clipboard: {} },
  window: {},
  document: {},
};

vm.createContext(context);
vm.runInContext(pixScript, context);

assert.equal(typeof context.isPixReady, 'function');
assert.equal(typeof context.buildPixPayload, 'function');
assert.equal(typeof context.sanitizeName, 'function');
assert.equal(typeof context.crc16, 'function');
assert.equal(context.isPixReady({
  receiverName: 'Ana e Bruno',
  city: 'Sao Paulo',
  pixKey: 'ana@email.com',
  amount: ''
}), true);
assert.equal(context.isPixReady({
  receiverName: 'Ana e Bruno',
  city: 'Sao Paulo',
  pixKey: 'invalid',
  amount: ''
}), false);
const payload = context.buildPixPayload({
  receiverName: 'Ana e Bruno',
  city: 'Sao Paulo',
  pixKey: 'ana@email.com',
  amount: '150.00',
});
assert.match(payload, /^000201/);
assert.ok(payload.length > 100);
assert.ok(context.crc16(payload.slice(0, -4)).length === 4);
assert.equal(context.sanitizeName('José & Maria'), 'Jose Maria');

const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
assert.match(html, /Nosso Chá de Casa Nova/);
assert.match(html, /css\/styles.css/);
assert.match(html, /js\/config.js/);
assert.match(html, /js\/pix.js/);

console.log('Smoke tests passed: Pix validation, payload generation and page assets are working.');
