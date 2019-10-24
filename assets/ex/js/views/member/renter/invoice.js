window.onload = function () {
  var token = Cookies.get("cookie_token");
  // var id_kos = getUrlParameter('kos'); // wajib
  var id_pembayaran = getUrlParameter('invoice');
  getData(token, id_pembayaran);
}

const getData = async (token, id_pembayaran) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getInv        = await getInvoice(token, id_pembayaran);
}

function getComponentUI(){
  $("#page_name").text("Invoice");
  $("#title").text("Invoice");
}

function getInvoice(token, id_pembayaran) {
  var output = $.ajax({
    url   : domain+"/pembayaran/"+id_pembayaran,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      // $("#avatar_pembayaran").attr("src", response.foto);
      $("#nama").text(response.nama);
      $("#nama_kos").text(response.nama_kos);
      $("#kamar").text(response.kamar);
      $("#durasi").text(response.durasi+" "+response.tipe_pembayaran);
      $("#tgl_masuk").text(response.tanggal_masuk);
      $("#tgl_akhir").text(response.tanggal_akhir);
      $("#tgl_penagihan").text(response.tanggal_penagihan);
      $("#jatuh_tempo").text(response.jatuh_tempo);
      $("#total").text(response.total_pembayaran);
      $("#dibayar").text(response.total_dibayar);
      $("#tagihan").text(response.tagihan);
      $("#harga_sewa").text(response.harga_sewa);

      var strfoto = response.foto.split("/");
      str4 = strfoto[strfoto.length-1];
      str3 = strfoto[strfoto.length-2];
      str2 = strfoto[strfoto.length-3];
      str1 = strfoto[strfoto.length-4];
      var foto = str1+"/"+str2+"/"+str3+"/"+str4;

      $("#avatar_pembayaran").attr("src", "https://res.cloudinary.com/dbddhr9rz/image/upload/w_400,h_400,c_crop,g_face,r_max/w_180/"+foto);

      // var status_pembayaran;
      if (response.status_pembayaran == "lunas") {
        var status_pembayaran = '<div class="badge badge-success">Lunas</div>';
      } else if (response.status_pembayaran == "angsur") {
        var status_pembayaran = '<div class="badge badge-warning">Angsur</div>';
      } else {
        var status_pembayaran = '<div class="badge badge-danger">Belum Bayar</div>';
      }
      $(".ticket-info").append(status_pembayaran);

      $.each(response.tanggal_pembayaran_list, function(idx, value) {
        var data = '<tr>'+
          '<td>'+(idx+1)+'</td>'+
          '<td>'+value.tanggal_pembayaran+'</td>'+
          '<td class="text-right"><b class="rupiah">'+value.nominal+'</b></td>'+
        '</tr>';
        $("#tb_tgl_pembayaran").append(data);
      });
      var td_total_dibayar = '<tr>'+
        '<td></td>'+
        '<td><h5>TELAH DIBAYAR </h5></td>'+
        '<td class="text-right"><h5 class="rupiah">'+response.total_dibayar+'</h5></td>'+
      '</tr>';
      $("#tb_tgl_pembayaran").append(td_total_dibayar);

      $.each(response.biaya_tambahan_list, function(idx, value) {
        var data = '<tr>'+
          '<td>'+(idx+2)+'</td>'+
          '<td>'+value.keterangan+'</td>'+
          '<td class="text-right"><b class="rupiah">'+value.nominal+'</b></td>'+
          '</tr>';
        $("#tb_biaya_tambahan").append(data);
      });

      var td_total_pembayaran = '<tr>'+
        '<td></td>'+
        '<td><h5>TOTAL</h5></td>'+
        '<td class="text-right"><h5 class="rupiah">'+response.total_pembayaran+'</h5></td>'+
      '</tr>';
      $("#tb_biaya_tambahan").append(td_total_pembayaran);

      $(".rupiah").mask('000.000.000', {reverse: true});
    }, error: function(error){
      console.log("error");
    }
  });

  return output;
}
