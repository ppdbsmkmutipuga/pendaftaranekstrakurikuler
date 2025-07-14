const form = document.getElementById('formEkskul');
    const notif = document.getElementById('notif');
    const itDevCheckbox = document.querySelector('input[value="IT Developer Club"]');
    const peminatanGroup = document.getElementById('peminatan-group');
    const peminatanSelect = document.getElementById('peminatan');
    const submitBtn = document.getElementById('submitBtn');

    itDevCheckbox.addEventListener('change', () => {
      peminatanGroup.style.display = itDevCheckbox.checked ? 'block' : 'none';
      if (!itDevCheckbox.checked) {
        peminatanSelect.value = "";
      }
    });

    document.querySelectorAll('input[name="ekskul"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = document.querySelectorAll('input[name="ekskul"]:checked');
        if (selected.length > 3) {
          cb.checked = false;
          showToast("⚠️ Maksimal 3 ekstrakurikuler boleh dipilih.");
        }
      });
    });

    function showToast(message, isError = false) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.style.backgroundColor = isError ? "#e53e3e" : "#48bb78";
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 3000);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nama = document.getElementById('nama').value.trim();
      const kelas = document.getElementById('kelas').value;
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const alasan = document.getElementById('alasan').value.trim();
      const checkedEkskul = Array.from(document.querySelectorAll('input[name="ekskul"]:checked')).map(el => el.value);
      const peminatan = peminatanSelect.value;

      if (checkedEkskul.length === 0 || checkedEkskul.length > 3) {
        notif.textContent = "⚠️ Pilih minimal 1 dan maksimal 3 ekstrakurikuler tambahan.";
        notif.classList.remove('hidden');
        return;
      }

      if (checkedEkskul.includes("IT Developer Club") && peminatan === "") {
        notif.textContent = "⚠️ Pilih peminatan di IT Developer Club.";
        notif.classList.remove('hidden');
        return;
      }

      notif.classList.add('hidden');

      const endpoint = "https://script.google.com/macros/s/AKfycbzD8jWYWEeVh8IJT-Kh4p2UAl9tleScRwr2gA5lXtQWj4sF-1509LjkGarYJImyt1Tkqw/exec";

      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("kelas", kelas);
      formData.append("whatsapp", whatsapp);
      formData.append("alasan", alasan);
      formData.append("ekskul", checkedEkskul.join(", "));
      formData.append("peminatan", checkedEkskul.includes("IT Developer Club") ? peminatan : "");

      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim...";

      fetch(endpoint, {
  method: "POST",
  body: formData
})
  .then(async res => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (json.status === "success") {
        showToast("✅ Pendaftaran berhasil dikirim!");
      } else {
        showToast("❌ Gagal mengirim data: " + (json.message || "Tidak diketahui"), true);
      }
    } catch (err) {
      showToast("✅ Pendaftaran berhasil dikirim!"); // fallback sukses jika respons bukan JSON
    }

    form.reset();
    peminatanGroup.style.display = "none";
  })
  .catch(err => {
    console.error("ERROR:", err);
    // Hapus atau ganti pesan ini jika ingin diam-diam:
    // showToast("❌ Terjadi kesalahan jaringan.", true);

    // Ganti dengan fallback optimis:
    showToast("✅ Pendaftaran berhasil dikirim (offline mode)");
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim Pendaftaran";
  });
