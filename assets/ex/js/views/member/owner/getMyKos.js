function getMyKos(slug, id_member, token){
  var mykos = $.ajax({
    url   : domain+"/mykos/"+slug+"/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      if (response.id_kos != 0) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                          ];
        var date = new Date();
        var bulan = monthNames[date.getMonth()];
        var tahun = date.getFullYear();

        $(".section").removeAttr('hidden');
        // $("#title").text(response.nama_kos);
        $(".nama_kos").text(response.nama_kos);
        $("#id_kos").val(response.id_kos);
        $(".link_dashboard").attr("href", "/dashboard?kos="+response.slug);
        $(".link_laporan-pembayaran").attr("href", "/laporan-pembayaran?kos="+response.slug+"&bulan="+bulan+"&tahun="+tahun);
        $(".link_laporan-bulanan").attr("href", "/laporan-bulanan?kos="+response.slug+"&tahun="+tahun);
        $(".link_daftar-renter").attr("href", "/daftar-anak-kos?kos="+response.slug);
        $(".link_pengaturan").attr("href", "/pengaturan?kos="+response.slug);

        var btn_booking = (response.booking == "Tidak Terdaftar" ? '<a href="https://getstisla.com/docs" class="btn btn-primary btn-lg btn-block btn-icon-split"><i class="fas fa-calendar-check"></i> Aktifkan Fitur Booking</a>'
        :'');

        $("#btn_booking").append(btn_booking);

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
  });
  return mykos;
}
