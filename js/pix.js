function emv(id, value) {
  const length = String(value.length).padStart(2, "0");
  return id + length + value;
}

function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function sanitizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 25);
}

function sanitizeCity(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15);
}

function isValidPixKey(value) {
  const key = String(value || "").trim();
  if (!key) return false;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?\d{10,14}$/;
  const cpfPattern = /^\d{11}$/;
  const cnpjPattern = /^\d{14}$/;
  const randomKeyPattern = /^[a-zA-Z0-9-_.]{8,}$/;

  return (
    emailPattern.test(key) ||
    phonePattern.test(key) ||
    cpfPattern.test(key) ||
    cnpjPattern.test(key) ||
    randomKeyPattern.test(key)
  );
}

function isValidAmount(value) {
  if (!value) return true;
  return /^\d+(\.\d{1,2})?$/.test(String(value).trim());
}

function isPixReady(pix) {
  if (!pix) return false;
  const name = sanitizeName(pix.receiverName);
  const city = sanitizeCity(pix.city);
  const key = String(pix.pixKey || "").trim();
  return Boolean(name && city && isValidPixKey(key) && isValidAmount(pix.amount));
}

function buildPixPayload(pix) {
  const name = sanitizeName(pix.receiverName);
  const city = sanitizeCity(pix.city);
  const key = String(pix.pixKey).trim();
  const merchantAccount = emv("00", "br.gov.bcb.pix") + emv("01", key);
  let payload = "";
  payload += emv("00", "01");
  payload += emv("26", merchantAccount);
  payload += emv("52", "0000");
  payload += emv("53", "986");
  if (pix.amount) {
    payload += emv("54", String(pix.amount).trim());
  }
  payload += emv("58", "BR");
  payload += emv("59", name);
  payload += emv("60", city);
  payload += emv("62", emv("05", "***"));
  payload += "6304";
  return payload + crc16(payload);
}
