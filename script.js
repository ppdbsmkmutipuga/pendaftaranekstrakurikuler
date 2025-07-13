const form = document.getElementById('formEkskul');
const notif = document.getElementById('notif');
const itDevCheckbox = document.querySelector('input[value="IT Developer Club"]');
const peminatanGroup = document.getElementById('peminatan-group');
const peminatanSelect = document.getElementById('peminatan');
const submitBtn = form.querySelector('button[type="submit"]');

// Tampilkan/sembunyikan peminatan saat IT Dev dipilih
itDevCheckbox.addEventListener('change', () => {
    peminatanGroup.style.display = itDevCheckbox.checked ? 'block' : 'none';
    if (!itDevCheckbox.checked) {
        peminatanSelect.value = "";
    }
});

// Maksimal 3 ekskul
document.querySelectorAll('input[name="ekskul"]').forEach(cb => {
    cb.addEventListener('change', () => {
        const selected = document.querySelectorAll('input[name="ekskul"]:checked');
        if (selected.length > 3) {
            cb.checked = false;
            showToast("⚠️ Maksimal 3 ekstrakurikuler boleh dipilih.");
        }
    });
});

// Fungsi toast
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
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

    // Validasi ekskul
    if (checkedEkskul.length === 0 || checkedEkskul.length > 3) {
        notif.textContent = "⚠️ Pilih minimal 1 dan maksimal 3 ekstrakurikuler tambahan.";
        notif.classList.remove('hidden');
        return;
    }

    // Validasi peminatan jika pilih IT Dev
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

    // Disable tombol kirim saat proses
    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

fetch(endpoint, {
    method: "POST",
    body: formData
})
.then(async (res) => {
    const status = res.status;

    // Tetap lanjut meski tidak bisa parse JSON karena CORS
    let text = "";
    try {
        text = await res.text();
        const json = JSON.parse(text);
        if (json.status === "success") {
            showToast("✅ Pendaftaran berhasil dikirim!");
            form.reset();
            peminatanGroup.style.display = "none";
        } else {
            showToast("❌ Gagal mengirim data.");
        }
    } catch (err) {
        if (status === 200) {
            console.warn("Respons bukan JSON valid, tapi kemungkinan berhasil. Tampilkan toast sukses.");
            showToast("✅ Pendaftaran berhasil dikirim!");
            form.reset();
            peminatanGroup.style.display = "none";
        } else {
            console.error("Respons gagal diparse dan status bukan 200:", err);
            showToast("❌ Terjadi kesalahan saat mengirim data.");
        }
    }
})
.finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim Pendaftaran";
});
