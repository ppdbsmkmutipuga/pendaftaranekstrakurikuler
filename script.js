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
            notif.textContent = "⚠️ Maksimal 3 ekstrakurikuler boleh dipilih.";
            notif.classList.remove('hidden');
        }
    });
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const alasan = document.getElementById('alasan').value.trim();
    const saranEkskul = document.getElementById('saranEkskul').value.trim();
    const checkedEkskul = Array.from(document.querySelectorAll('input[name="ekskul"]:checked')).map(el => el.value);
    const peminatan = peminatanSelect.value;

    // Validasi WhatsApp
    if (!/^(08|\+628)[0-9]{7,13}$/.test(whatsapp)) {
        notif.textContent = "⚠️ Masukkan nomor WhatsApp yang valid, hanya angka dan awalan 08 atau +62.";
        notif.classList.remove('hidden');
        return;
    }

    // Validasi Nama
    if (!/^[A-Za-zÀ-ÿ\s']{3,50}$/.test(nama)) {
        notif.textContent = "⚠️ Nama hanya boleh huruf, spasi, dan tanda petik.";
        notif.classList.remove('hidden');
        return;
    }

    // Validasi Jumlah Ekstrakurikuler
    if (checkedEkskul.length === 0 || checkedEkskul.length > 3) {
        notif.textContent = "⚠️ Pilih minimal 1 dan maksimal 3 ekstrakurikuler tambahan.";
        notif.classList.remove('hidden');
        return;
    }

    // Validasi Peminatan jika pilih IT Dev
    if (checkedEkskul.includes("IT Developer Club") && peminatan === "") {
        notif.textContent = "⚠️ Pilih peminatan di IT Developer Club.";
        notif.classList.remove('hidden');
        return;
    }

    notif.classList.add('hidden');

    const endpoint = "https://script.google.com/macros/s/AKfycbzD8jWYWEeVh8IJT-Kh4p2UAl9tleScRwr2gA5lXtQWj4sF-1509LjkGarYJImyt1Tkqw/exec";

    const payload = {
        nama,
        kelas,
        whatsapp,
        alasan,
        ekskul: checkedEkskul.join(", "),
        peminatan: checkedEkskul.includes("IT Developer Club") ? peminatan : "",
        saranEkskul
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const text = await res.text();
            try {
                const json = JSON.parse(text);
                if (json.status === "success") {
                    tampilkanPesanSukses();
                    form.reset();
                    peminatanGroup.style.display = "none";
                } else {
                    notif.textContent = "❌ Gagal mengirim data.";
                    notif.classList.remove('hidden');
                }
            } catch (err) {
                tampilkanPesanSukses(); // fallback kalau response bukan JSON
                form.reset();
                peminatanGroup.style.display = "none";
            }
        })
        .catch(err => {
            console.error("Detail error:", err);
            notif.textContent = "❌ Terjadi kesalahan jaringan.";
            notif.classList.remove('hidden');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Kirim Pendaftaran";
        });
});

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
