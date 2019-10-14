function swalert(tipe, judul, pesan){
  Swal.fire({
    type : tipe,
    title: judul,
    text : pesan,
    showConfirmButton: true,
    timer: 2500
  })
}

function swalertError(){
  Swal.fire({
    type: 'error',
    title: 'Oops... Terjadi Kesalahan',
    text: 'Coba beberapa saa lagi!',
    timer: 2500
  })
}

function swalertConfirm(tipe, pesan, link, jsonData, judul_konfirmasi, pesan_konfirmasi, method, token) {
  console.log(token);
  Swal.fire({
    title: 'Apakah Anda Yakin?',
    text: pesan,
    type: tipe,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url   : link,
        type  : method,
        headers: {"Authorization": "Bearer "+token},
        data : jsonData,
        contentType: 'application/json',
        success: function(response){
          if (response.status == true) {
            swalert('success', judul_konfirmasi, pesan_konfirmasi);
            setTimeout(function () {
      				location.reload();
      			}, 2500);
          } else {
            swalert('warning','Terjadi Kesalahan', 'Coba beberapa saat lagi.');
          }
        },
        error:function(error){
          console.log("error");
        }
      })


      // swalert('success', judul_konfirmasi, pesan_konfirmasi);
    }
  })
}
