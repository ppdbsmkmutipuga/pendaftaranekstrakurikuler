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
    alert(`Terima kasih, ${nama}!\nKelas: ${kelas}\nWhatsApp: ${whatsapp}\nEkskul: ${checkedEkskul.join(', ')}\nAlasan: ${alasan}`);
    form.reset();
});

document.querySelectorAll('input[name="ekskul"]').forEach(cb => {
    cb.addEventListener('change', () => {
        const selected = document.querySelectorAll('input[name="ekskul"]:checked');
        if (selected.length > 3) {
            cb.checked = false;
            notif.textContent = "⚠️ Maksimal hanya boleh memilih 3 ekstrakurikuler tambahan.";
            notif.classList.remove('hidden');
        } else {
            notif.classList.add('hidden');
        }
    });
});
