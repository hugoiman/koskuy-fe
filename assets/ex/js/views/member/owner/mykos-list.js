window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  $("#page_name").text("Daftar Kos Saya");
  $("#title").text("Daftar Kos Saya");
  const jsonToken = await authToken(token);
  const getMykosList = await getMyKosList(jsonToken.Id_user, token);
}

function getMyKosList(id_member,token) {
  $.ajax({
    url   : domain+"/mykos/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(data){
      if (data.kos_list == null) {
        $("#empty").removeAttr('hidden');
      } else {
        $("#mykoslist").removeAttr('hidden');
        $("#page_name").text("Daftar My Kos");
        $.each(data.kos_list, function(idx, value) {
          var html = '<div class="col-12 col-sm-6 col-md-6 col-lg-4">'+
            '<article class="article">'+
              '<div class="article-header">'+
                '<div class="article-image" data-background="/static/img/news/img08.jpg" style="background-image: url(/static/img/news/img08.jpg);">'+
                '</div>'+
                '<div class="article-title">'+
                  '<h2><a href="#">'+value.nama_kos+'</a></h2>'+
                '</div>'+
              '</div>'+
              '<div class="article-details">'+
                '<b>'+value.tipe_kos+' <span class="bullet"></span> Lowokwaru<br>'+
                'Rp <span class="rupiah">'+value.harga_sewa_list[0].bulanan+'</span>/bulan </b><br><span class="bullet"></span>'+
                '<small>Diperbarui 2 hari yang lalu</small>'+
                '<div class="article-cta">'+
                  '<a href="/laporan-pembayaran?kos='+value.id_kos+'&bulan=September&tahun=2019" class="btn btn-primary"><i class="far fa-eye"></i> Lihat</a> '+
                  '<a href="/pengaturan?kos=' + value.id_kos +'" class="btn btn-warning"><i class="fas fa-cog"></i> Pengaturan</a>'+
                '</div>'+
              '</div>'+
            '</article>'+
          '</div>';
          $("#mykoslist").append(html);
          $(".rupiah").mask('000.000.000', {reverse: true});
        });
      }
    },
    error:function(error){
      console.log(error);
    }
  })
}
