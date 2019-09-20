window.onload = function () {
  var token = Cookies.get("cookie_token");
  var id_kos = getUrlParameter('kos'); // wajib
  var id_pembayaran = getUrlParameter('id');
  getData(token, id_kos, id_pembayaran);
}

const getData = async (token, id_kos, id_pembayaran) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(id_kos, jsonToken.Id_user, token);
  const getPembayaran = await getDetailPembayaran(token, id_pembayaran);
}

function getComponentUI(){
  $(".laporan").addClass("active");
  $(".laporan-pembayaran").addClass("active");
  $("#page_name").text("Detail Pembayaran");
  $("#title").text("Detail Pembayaran");
}

function getDetailPembayaran(token, id_pembayaran) {
  $.ajax({
    url   : domain+"/pembayaran/"+id_pembayaran,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      console.log(response);
      $("#avatar_pembayaran").attr("src", response.foto);
      $("#nama").text(response.nama);
      $("#kamar").text(response.kamar);
      $("#durasi").text(response.durasi+" "+response.tipe_pembayaran);
      $("#tgl_masuk").text(response.tanggal_awal);
      $("#tgl_selesai").text(response.tanggal_akhir);
      $("#tgl_dibayar").text(response.tanggal_dibayar);
      $("#total").text(response.total);
      $("#dibayar").text(response.dibayar);
      $("#tagihan").text(response.tagihan);
      $("#harga_sewa").text(response.harga_sewa);

      // var status_pembayaran;
      if (response.status_pembayaran == "lunas") {
        var status_pembayaran = '<div class="badge badge-success">Lunas</div>';
      } else if (response.status_pembayaran == "angsur") {
        var status_pembayaran = '<div class="badge badge-warning">Angsur</div>';
      } else {
        var status_pembayaran = '<div class="badge badge-danger">Belum Bayar</div>';
      }
      $(".ticket-info").append(status_pembayaran);

      $.each(response.pembayaran_lain, function(idx, value) {
        var data = '<tr>'+
          '<td>'+(idx+2)+'</td>'+
          '<td>'+value.deskripsi+'</td>'+
          '<td class="text-right">Rp. <b class="rupiah">'+value.jumlah+'</b></td>'+
        '</tr>';
        $(".table-md").append(data);
      });

      $(".rupiah").mask('000.000.000', {reverse: true});
    }, error: function(error){
      console.log("error");
    }
  })
}
