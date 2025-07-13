// Script opsional: contoh validasi atau aksi setelah submit
document.getElementById('formEkskul').addEventListener('submit', function (e) {
    e.preventDefault();

    // Ambil nilai input
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const ekskul = document.getElementById('ekskul').value;
    const alasan = document.getElementById('alasan').value;

    // Contoh aksi: tampilkan alert
    alert(`Terima kasih ${nama}, pendaftaran ke ekskul ${ekskul} berhasil disimpan!`);

    // Reset form (opsional)
    this.reset();
});
const form = document.getElementById('formEkskul');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const alasan = document.getElementById('alasan').value;

    const checkedEkskul = Array.from(document.querySelectorAll('input[name="ekskul"]:checked')).map(el => el.value);

    if (checkedEkskul.length === 0 || checkedEkskul.length > 3) {
        alert("Pilih minimal 1 dan maksimal 3 ekstrakurikuler.");
        return;
    }

    alert(`Terima kasih ${nama}, kamu memilih: ${checkedEkskul.join(', ')}`);
    form.reset();
});

// Batasi pemilihan maksimal 3 checkbox
document.querySelectorAll('input[name="ekskul"]').forEach(cb => {
    cb.addEventListener('change', function () {
        const checked = document.querySelectorAll('input[name="ekskul"]:checked');
        if (checked.length > 3) {
            this.checked = false;
            alert("Maksimal 3 ekstrakurikuler.");
        }
    });
});
document.querySelectorAll('input[name="ekskul"]').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const checked = document.querySelectorAll('input[name="ekskul"]:checked');
    if (checked.length > 3) {
      checkbox.checked = false;
      alert("Maksimal 3 ekstrakurikuler boleh dipilih.");
    }
  });
});
