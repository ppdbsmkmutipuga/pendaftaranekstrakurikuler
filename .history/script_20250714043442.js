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
