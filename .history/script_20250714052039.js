const form = document.getElementById('formEkskul');
const notif = document.getElementById('notif');
const itDevCheckbox = document.querySelector('input[value="IT Developer Club"]');
const peminatanGroup = document.getElementById('peminatan-group');
const peminatanSelect = document.getElementById('peminatan');

// Tampilkan atau sembunyikan peminatan jika IT Dev dicentang
itDevCheckbox.addEventListener('change', () => {
    if (itDevCheckbox.checked) {
        peminatanGroup.style.display = 'block';
    } else {
        peminatanGroup.style.display = 'none';
        peminatanSelect.value = "";
    }
});

// Batasi maksimal 3 ekskul
document.querySelectorAll('input[name="ekskul"]').forEach(cb => {
    cb.addEventListener('change', () => {
        const selected = document.querySelectorAll('input[name="ekskul"]:checked');
        if (selected.length > 3) {
            cb.checked = false;
            alert('Maksimal 3 ekstrakurikuler tambahan boleh dipilih.');
        }
    });
});

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

    // Validasi peminatan jika pilih IT Developer Club
    if (checkedEkskul.includes("IT Developer Club") && peminatan === "") {
        notif.textContent = "⚠️ Pilih peminatan di IT Developer Club.";
        notif.classList.remove('hidden');
        return;
    }

    notif.classList.add('hidden');

    // Ganti dengan URL Web Apps Google Apps Script kamu
    const endpoint = "https://script.google.com/macros/s/AKfycbzD8jWYWEeVh8IJT-Kh4p2UAl9tleScRwr2gA5lXtQWj4sF-1509LjkGarYJImyt1Tkqw/exec";

    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nama,
            kelas,
            whatsapp,
            ekskul: checkedEkskul,
            alasan,
            peminatan: checkedEkskul.includes("IT Developer Club") ? peminatan : ""
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.status === "success") {
                alert("✅ Data berhasil dikirim ke Google Sheet!");
                form.reset();
                peminatanGroup.style.display = "none"; // Sembunyikan lagi
            } else {
                alert("❌ Gagal mengirim data.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Terjadi kesalahan saat mengirim data.");
        });
});
