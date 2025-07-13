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
const ekskulSelect = document.getElementById('ekskul');

ekskulSelect.addEventListener('change', function () {
    const selectedOptions = Array.from(this.selectedOptions);
    if (selectedOptions.length > 3) {
        alert("Kamu hanya boleh memilih maksimal 3 ekstrakurikuler.");
        // Batalkan pilihan terakhir
        selectedOptions[selectedOptions.length - 1].selected = false;
    }
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const alasan = document.getElementById('alasan').value;
    const ekskulSelected = Array.from(ekskulSelect.selectedOptions).map(opt => opt.value);

    if (ekskulSelected.length === 0 || ekskulSelected.length > 3) {
        alert("Pilih minimal 1 dan maksimal 3 ekstrakurikuler.");
        return;
    }

    alert(`Terima kasih ${nama}, kamu telah mendaftar ke: ${ekskulSelected.join(', ')}`);
    form.reset();
});
