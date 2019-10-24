window.onload = function () {
  var token  = Cookies.get("cookie_token");
  var slug   = getUrlParameter('kos');
  var tahun  = getUrlParameter('tahun');
  getData(token, slug, tahun);
}

const getData = async (token, slug, tahun) => {
  const getCUI        = await getComponentUI(tahun);
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(slug, jsonToken.Id_user, token); // wajib
  const getTotalStatus  = await getStatusPembayaran(token, getDataMyKos.id_kos);
  const getLaporan    = await getLaporanBulanan(token, getDataMyKos.id_kos, tahun);
}

function getComponentUI(tahun){
  $(".laporan").addClass("active");
  $(".laporan-bulanan").addClass("active");
  $("#page_name").text("Laporan Bulanan");
  $("#title").text("Laporan Bulanan");
  $("#date").val(tahun);
}

function getLaporanBulanan(token, id_kos, tahun){
  $.ajax({
    url   : domain+"/laporan-bulanan/"+id_kos+"?tahun="+tahun,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      displayDataTable(response);

      $(".rupiah").mask('000.000.000', {reverse: true});
      $(".pemasukan").text("Pemasukan");
    }, error:function(error){
      console.log("error");
    }
  })
}

function displayDataTable(dataJson){
  $("#table-1").dataTable({
    data: dataJson.laporan_bulanan,
    columns: [
      { data: "periode"},
      { data: "pemasukan", className: "rupiah"},
      { data:
        function (data, type, dataToSet) {
            return '<td>500.000</td>';
          }
      },
      { data: function (data, type, dataToSet) {
          var bulan_tahun = data.periode.split(" ");
          return '<a href="laporan-pembayaran?kos=Kos-Array-Suhat&bulan='+bulan_tahun[0]+'&tahun='+bulan_tahun[1]+'" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="lihat"><i class="far fa-eye"></i></a>';
        }
      }
    ],
  });
}

function getStatusPembayaran(token, id_kos) {
  $.ajax({
    url   : domain+"/status-pembayaran/"+id_kos,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      $('#total-renter').text(response.total_renter);
      $('#total-lunas').text(response.lunas);
      $('#total-angsur').text(response.angsur);
      $('#total-belum_bayar').text(response.belum_bayar);
    }, error:function(error){
      console.log("error");
    }
  })
}
