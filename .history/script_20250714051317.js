const form = document.getElementById('formEkskul');
const notif = document.getElementById('notif');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const alasan = document.getElementById('alasan').value;
    const checkedEkskul = Array.from(document.querySelectorAll('input[name="ekskul"]:checked')).map(el => el.value);

    if (checkedEkskul.length === 0 || checkedEkskul.length > 3) {
        notif.textContent = "⚠️ Pilih minimal 1 dan maksimal 3 ekstrakurikuler tambahan.";
        notif.classList.remove('hidden');
        return;
    }

    notif.classList.add('hidden');

    // Ganti URL ini dengan URL Web Apps kamu dari Google Apps Script
    const endpoint = "https://script.google.com/macros/s/AKfycbxxxxx/exec";

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
            alasan
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.status === "success") {
                alert("✅ Data berhasil dikirim ke Google Sheet!");
                form.reset();
            } else {
                alert("❌ Gagal mengirim data.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Terjadi kesalahan saat mengirim data.");
        });
});
