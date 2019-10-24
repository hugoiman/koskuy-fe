window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const getCUI     = await getComponentUI();
  const jsonToken  = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getFav     = await getFavorit(jsonToken.Id_user, token)
}

function getComponentUI(){
  $("#page_name").text("Favorit");
  $("#title").text("Favorit");
}

function getHistoriPembayaran(token, id_member){
  $.ajax({
    url   : domain+"/favorit/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      if (data.kos_list == null) {
        $("#empty").removeAttr('hidden');
      } else {
        $("#favorit_list").removeAttr('hidden');
        $.each(data.favorit_list, function(idx, value) {
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
                '<b>'+value.tipe_kos+' <span class="bullet"></span> Lowokwaru <div class="badge badge-success">'+value.status_kos+'</div><br>'+
                'Rp <span class="rupiah">'+value.harga_sewa_list[0].bulanan+'</span>/bulan </b><br><span class="bullet"></span>'+
                '<small>'+value.update_at+'</small>'+
                '<div class="article-cta">'+
                  '<a href="/laporan-pembayaran?kos='+value.slug+'&bulan=September&tahun=2019" class="btn btn-primary"><i class="fas fa-cogs"></i> Kelola</a> '+

                '</div>'+
              '</div>'+
            '</article>'+
          '</div>';

          $("#mykoslist").append(html);

          $(".rupiah").mask('000.000.000', {reverse: true});
        });
      }
    }, error:function(error){
      console.log("error");
    }
  })
}
