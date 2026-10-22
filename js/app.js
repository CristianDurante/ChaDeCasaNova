(function () {
  const coupleEl = document.getElementById("coupleNames");
  const photoEl = document.getElementById("machinePhoto");
  const placeholderEl = document.getElementById("machinePlaceholder");
  const pixSoonEl = document.getElementById("pixSoon");
  const pixContentEl = document.getElementById("pixContent");
  const pixKeyEl = document.getElementById("pixKeyValue");
  const copyBtn = document.getElementById("copyPixBtn");
  const copyStatus = document.getElementById("copyStatus");
  const qrEl = document.getElementById("qrcode");

  const names = String(SITE_CONFIG.coupleNames || "").trim();
  if (names) {
    coupleEl.textContent = names;
    coupleEl.classList.remove("is-empty");
  }

  const imageSrc = String(SITE_CONFIG.washingMachineImage || "").trim();
  const isPlaceholder = !imageSrc || imageSrc.indexOf("placeholder-maquina") !== -1;

  if (!isPlaceholder) {
    photoEl.src = imageSrc;
    photoEl.hidden = false;
    placeholderEl.hidden = true;
    photoEl.onerror = function () {
      photoEl.hidden = true;
      placeholderEl.hidden = false;
    };
  }

  const pixReady = isPixReady(SITE_CONFIG.pix);

  if (!pixReady) {
    pixSoonEl.hidden = false;
    pixContentEl.hidden = true;
    return;
  }

  pixSoonEl.hidden = true;
  pixContentEl.hidden = false;
  pixKeyEl.textContent = SITE_CONFIG.pix.pixKey.trim();

  const payload = buildPixPayload(SITE_CONFIG.pix);
  if (window.QRCode && typeof QRCode.toCanvas === "function") {
    QRCode.toCanvas(
      payload,
      {
        width: 220,
        margin: 1,
        color: { dark: "#4a433a", light: "#ffffff" }
      },
      function (error, canvas) {
        if (error) {
          qrEl.textContent = "Não foi possível gerar o QR Code. Use a chave Pix ao lado.";
          return;
        }
        qrEl.appendChild(canvas);
      }
    );
  } else {
    qrEl.textContent = "Use a chave Pix ao lado para contribuir pelo aplicativo do banco.";
  }

  function showCopyStatus(message) {
    copyStatus.textContent = message;
  }

  copyBtn.addEventListener("click", async function () {
    const key = SITE_CONFIG.pix.pixKey.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(key);
      } else {
        const area = document.createElement("textarea");
        area.value = key;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      showCopyStatus("Chave Pix copiada. Agora é só colar no aplicativo do banco.");
    } catch (err) {
      showCopyStatus("Não foi possível copiar automaticamente. Selecione a chave e copie manualmente.");
    }
  });
})();
