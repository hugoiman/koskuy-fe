function getMyKos(id_kos, id_member, token){
  $.ajax({
    url   : "http://localhost:8000/mykos?kos="+id_kos+"&member="+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      console.log(response);
      if (response.id_kos != 0) {
        $(".section").removeAttr('hidden');
        $("#title").text(response.nama_kos);
        $(".nama_kos").text(response.nama_kos);
        $(".link_dashboard").attr("href", "/dashboard?kos="+response.id_kos);
        $(".link_laporan-pembayaran").attr("href", "/laporan-pembayaran?kos="+response.id_kos+"&bulan=May&tahun=2019");
        $(".link_laporan-bulanan").attr("href", "/laporan-bulanan?kos="+response.id_kos+"&bulan=May&tahun=2019");
        $(".link_daftar-renter").attr("href", "/daftar-renter?kos="+response.id_kos);
        $(".link_pengaturan").attr("href", "/pengaturan?kos="+response.id_kos);
      } else {
        $(".section").hide();
        var error404 ='<section class="section">'+
          '<div class="section-header">'+
            '<h1>Halaman tidak ditemukan</h1>'+
          '</div>'+
          '<div class="section-body">'+
            '<div class="row">'+
              '<div class="col-12 col-md-4 col-sm-12"></div>'+
              '<div class="col-12 col-md-4 col-sm-12">'+
                '<div class="card">'+
                  '<div class="card-body">'+
                    '<div class="empty-state" data-height="600">'+
                      '<img class="img-fluid" src="/static/img/drawkit/drawkit-nature-man-colour.svg" alt="image">'+
                      '<h2 class="mt-0">Sepertinya kamu tersesat</h2>'+
                      '<p class="lead">Kami tidak dapat menemukan halaman yang kamu cari, periksa url dan coba lagi.</p>'+
                      '<a href="javascript:history.back()" class="btn btn-warning mt-4">Kembali</a>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '<section>';

        // append card
        $(".main-content").append(error404);
      }
    },
    error:function(error){

    }
  })
}
