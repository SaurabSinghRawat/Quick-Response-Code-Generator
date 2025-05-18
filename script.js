function generateQRCode() {
    const container = document.getElementById('qrcode');
    const shareBtn = document.getElementById('shareBtn');
    const text = document.getElementById('text').value.trim();

    container.innerHTML = '';
    shareBtn.style.display = 'none';

    if (!text) {
      alert('Please enter a valid input.');
      return;
    }

    const tempDiv = document.createElement("div");
    new QRCode(tempDiv, {
      text: text,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    setTimeout(() => {
      const img = tempDiv.querySelector('img') || tempDiv.querySelector('canvas');
      if (img) {
        container.appendChild(img);
        container.style.display = 'flex';
        const dataUrl = img.src || img.toDataURL("image/png");

        if (navigator.canShare && navigator.canShare({ files: [new File([], '')] })) {
          shareBtn.style.display = 'inline-block';
          shareBtn.onclick = async () => {
            try {
              const blob = await fetch(dataUrl).then(res => res.blob());
              const file = new File([blob], 'qrcode.png', { type: 'image/png' });
              await navigator.share({
                files: [file],
                title: 'QR Code',
                text: 'Here is your QR code.',
              });
            } catch (err) {
              alert('Share failed: ' + err.message);
            }
          };
        }
      }
    }, 100);
  }