const form = document.getElementById('formEkskul');
const notif = document.getElementById('notif');
const itDevCheckbox = document.querySelector('input[value="IT Developer Club"]');
const peminatanGroup = document.getElementById('peminatan-group');
const peminatanSelect = document.getElementById('peminatan');
const submitBtn = document.getElementById('submitBtn');

const endpoint = "https://script.google.com/macros/s/AKfycbzD8jWYWEeVh8IJT-Kh4p2UAl9tleScRwr2gA5lXtQWj4sF-1509LjkGarYJImyt1Tkqw/exec";

// Tampilkan/matikan peminatan jika checkbox IT Developer Club diubah
itDevCheckbox.addEventListener('change', () => {
    peminatanGroup.style.display = itDevCheckbox.checked ? 'block' : 'none';
    if (!itDevCheckbox.checked) {
        peminatanSelect.value = "";
    }
});

// Batasi pilihan ekskul maksimal 3
document.querySelectorAll('input[name="ekskul"]').forEach(cb => {
    cb.addEventListener('change', () => {
        const selected = document.querySelectorAll('input[name="ekskul"]:checked');
        if (selected.length > 3) {
            cb.checked = false;
            notif.textContent = "⚠️ Maksimal 3 ekstrakurikuler boleh dipilih.";
            notif.classList.remove('hidden');
        }
    });
});

// Handle submit
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Ambil nilai form
    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const alasan = document.getElementById('alasan').value.trim();
    const saranEkskul = document.getElementById('saranEkskul').value.trim();
    const checkedEkskul = Array.from(document.querySelectorAll('input[name="ekskul"]:checked')).map(el => el.value);
    const peminatan = peminatanSelect.value;

    // Validasi WhatsApp
    if (!/^(08|\+628)[0-9]{7,13}$/.test(whatsapp)) {
        return tampilkanError("⚠️ Masukkan nomor WhatsApp yang valid, hanya angka dan awalan 08 atau +62.");
    }

    // Validasi Nama
    if (!/^[A-Za-zÀ-ÿ\s']{3,50}$/.test(nama)) {
        return tampilkanError("⚠️ Nama hanya boleh huruf, spasi, dan tanda petik.");
    }

    // Validasi Jumlah Ekskul
    if (checkedEkskul.length === 0 || checkedEkskul.length > 3) {
        return tampilkanError("⚠️ Pilih minimal 1 dan maksimal 3 ekstrakurikuler.");
    }

    // Validasi Peminatan
    if (checkedEkskul.includes("IT Developer Club") && peminatan === "") {
        return tampilkanError("⚠️ Pilih peminatan di IT Developer Club.");
    }

    notif.classList.add('hidden');

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("kelas", kelas);
    formData.append("whatsapp", whatsapp);
    formData.append("alasan", alasan);
    formData.append("ekskul", checkedEkskul.join(", "));
    formData.append("peminatan", checkedEkskul.includes("IT Developer Club") ? peminatan : "");
    formData.append("saranEkskul", saranEkskul);

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    fetch(endpoint, {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(text => {
        try {
            const json = JSON.parse(text);
            if (json.status === "success") {
                tampilkanPesanSukses();
                form.reset();
                peminatanGroup.style.display = "none";
            } else {
                tampilkanError("❌ Gagal mengirim data.");
            }
        } catch (err) {
            tampilkanError("❌ Respon server tidak valid.");
        }
    })
    .catch(err => {
        console.error("Error:", err);
        tampilkanError("❌ Terjadi kesalahan jaringan.");
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Pendaftaran";
    });
});

// Tampilkan error di notifikasi
function tampilkanError(pesan) {
    notif.textContent = pesan;
    notif.classList.remove('hidden');
}

// Tampilkan pesan sukses
function tampilkanPesanSukses() {
    alert("✅ Pendaftaran berhasil dikirim!");

    const existingNotif = document.getElementById("notif-berhasil");
    if (existingNotif) existingNotif.remove();

    const suksesNotif = document.createElement("p");
    suksesNotif.textContent = "✅ Formulir berhasil dikirim!";
    suksesNotif.id = "notif-berhasil";
    suksesNotif.style.color = "green";
    suksesNotif.style.fontWeight = "bold";
    suksesNotif.style.marginTop = "20px";
    suksesNotif.style.textAlign = "center";

    form.parentNode.insertBefore(suksesNotif, form.nextSibling);
}
