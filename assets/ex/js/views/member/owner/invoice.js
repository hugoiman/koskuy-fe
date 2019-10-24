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
  const getPembayaran = await getDetailPembayaran(token, id_pembayaran);
  const getDataMyKos  = await getMyKos(getPembayaran.id_kos, jsonToken.Id_user, token);
}

function getComponentUI(){
  $(".laporan").addClass("active");
  $(".laporan-pembayaran").addClass("active");
  $("#page_name").text("Invoice");
  $("#title").text("Invoice");
}

function getDetailPembayaran(token, id_pembayaran) {
  var output = $.ajax({
    url   : domain+"/pembayaran/"+id_pembayaran,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      // $("#avatar_pembayaran").attr("src", response.foto);
      $("#invoice-number").text(response.id_pembayaran);
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

      if (response.denda != 0) {
        $("#tr_denda").attr("hidden", false)
        $("#denda").text(response.denda);
      }

      if (response.status_pembayaran == "Lunas") {
        var data = '<span class="badge badge-success">Lunas</span>';
      } else if (response.status_pembayaran == "Angsur") {
        var data = '<span class="badge badge-warning">Angsur</span>';
      } else {
        var data = '<span class="badge badge-danger">Belum Bayar</span>';
      }
      $("#status").append(data);

      var strfoto = response.foto.split("/");
      str4 = strfoto[strfoto.length-1];
      str3 = strfoto[strfoto.length-2];
      str2 = strfoto[strfoto.length-3];
      str1 = strfoto[strfoto.length-4];
      var foto = str1+"/"+str2+"/"+str3+"/"+str4;

      $("#avatar_pembayaran").attr("src", "https://res.cloudinary.com/dbddhr9rz/image/upload/w_400,h_400,c_crop,g_face,r_max/w_180/"+foto);

      $.each(response.tanggal_pembayaran_list, function(idx, value) {
        var data = '<tr>'+
          '<td>'+(idx+1)+'</td>'+
          '<td>'+value.tanggal_pembayaran+'</td>'+
          '<td class="text-right"><b class="rupiah">'+value.nominal+'</b></td>'+
          '<td><button class="btn btn-sm btn-warning" data-toggle="tooltip" data-placement="top" title="edit"><i class="far fa-edit"></i></button></td>'+
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
        var no = 2;
        if ($("#tr_denda").is(":visible")) {
          no = 3;
        }
        var data = '<tr>'+
          '<td>'+(idx+no)+'</td>'+
          '<td>'+value.keterangan+'</td>'+
          '<td class="text-right"><b class="rupiah">'+value.nominal+'</b></td>'+
          '<td><butoon class="btn btn-sm btn-warning" data-toggle="tooltip" data-placement="top" title="edit"><i class="far fa-edit"></i></button></td>'+
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
