function swalert(tipe, judul, pesan){
  Swal.fire({
    type : tipe,
    title: judul,
    text : pesan,
    showConfirmButton: true,
    timer: 2500
  })
}

function swalertConfirm(tipe, pesan, url, data, judul_konfirmasi, pesan_konfirmasi) {
  Swal.fire({
    title: 'Apakah Anda Yakin?',
    text: pesan,
    type: 'tipe',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.value) {
      swalert('success', judul_konfirmasi, pesan_konfirmasi);
    }
  })
}
