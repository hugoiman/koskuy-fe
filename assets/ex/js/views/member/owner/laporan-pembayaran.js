window.onload = function () {
  var token  = Cookies.get("cookie_token");
  var id_kos = getUrlParameter('kos');
  var bulan  = getBulanStringToNumber(getUrlParameter('bulan'));
  var tahun  = getUrlParameter('tahun');
  getData(token, id_kos, bulan, tahun);
}

function getBulanStringToNumber(mon){
    var d = Date.parse(mon + "1, 2012");
    if(!isNaN(d)){
      return new Date(d).getMonth() + 1;
    }
  return -1;
 }

const getData = async (token, id_kos, bulan, tahun) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(id_kos, jsonToken.Id_user, token); // wajib
  const getLaporan    = await getLaporanPembayaran(token, id_kos, bulan, tahun);
  // const x = await getCount();
}

function getComponentUI(){
  $(".laporan").addClass("active");
  $(".laporan-pembayaran").addClass("active");
  $("#page_name").text("Laporan Pembayaran");
  $("#title").text("Laporan Pembayaran");
  var button = '<button id="add_pembayaran" class="btn btn-primary"><i class="fa fa-plus-circle"></i> Data Pembayaran</button> ';
  $(".section-header-button").append(button);
}

function getLaporanPembayaran(token, id_kos, bulan, tahun){
  $.ajax({
    url   : domain+"/laporan-pembayaran/"+id_kos+"?bulan="+bulan+"&tahun="+tahun,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      displayDataTable(response);
      $(".rupiah").mask('000.000.000', {reverse: true});
      $(".total").text("Total"); $(".dibayar").text("Dibayar"); $(".tagihan").text("Tagihan");
      var total_renter = response.pembayaran_list.filter(function(x) { return x; }).length;
      var total_lunas = response.pembayaran_list.filter(function(x) { return x.status_pembayaran == "lunas"; }).length;
      var total_angsur = response.pembayaran_list.filter(function(x) { return x.status_pembayaran == "angsur"; }).length;
      var total_belum_bayar = response.pembayaran_list.filter(function(x) { return x.status_pembayaran == "belum bayar"; }).length;

      $('#total-renter').text(total_renter);
      $('#total-lunas').text(total_lunas);
      $('#total-angsur').text(total_angsur);
      $('#total-belum_bayar').text(total_belum_bayar);
    }, error:function(error){
      console.log("error");
    }
  })


  // var total_renter;
  // var total_lunas;
  // var total_belum_bayar;
  // var total_angsur;

  // $(".rupiah").mask('000.000.000', {reverse: true});

  // $.ajax({
  //   url   : "http://localhost:3000/getLaporanPembayaran/"+id_kos,
  //   type  : 'GET',
  //   headers: {"Authorization": "Bearer "+token},
  //   success: function(data){
  //     console.log(data);
  //     $("#table-1").find('tbody').empty(); //add this line
  //
  //     $.each(data.pembayaran_list, function(idx, value) {
  //       var data = '<tr>'+
  //         '<td>'+(idx+1)+'</td>'+
  //         '<td>'+
  //           '<img alt="image" src="/static/img/members/1_monyet.jpg" class="rounded-circle" width="35" data-toggle="tooltip" title="Member 1"> '+value.nama+
  //         '</td>'+
  //         '<td>'+value.durasi+' '+value.tipe_pembayaran+'</td>'+
  //         '<td>'+value.kamar+'</td>'+
  //         '<td>'+value.tanggal_akhir+'</td>'+
  //         '<td class="rupiah">'+value.total+'</td>'+
  //         '<td class="rupiah">'+value.dibayar+'</td>'+
  //         '<td class="rupiah"><b>'+value.tagihan+'</b></td>'+
  //         (value.status_pembayaran == "lunas" ? '<td><center><div class="badge badge-success">Lunas</div></center></td>'
  //         : value.status_pembayaran == "angsur" ? '<td><center><div class="badge badge-warning">Angsur</div></center></td>'
  //         : '<td><center><div class="badge badge-danger">Belum Bayar</div></center></td>') +
  //         '<td>'+
  //           '<a href="pembayaran/1?member=hugo" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="lihat"><i class="far fa-eye"></i></a> '+
  //           '<button type="submit" class="btn btn-sm btn-danger btn-hapus_pembayaran" data-toggle="tooltip" data-placement="top" title="hapus"><i class="far fa-trash-alt"></i></button>'+
  //         '</td>'+
  //       '</tr>';
  //       // $("#table-1").find('tbody').append(data);
  //       // $(".rupiah").mask('000.000.000', {reverse: true});
  //     });
  //
  //
  //     // $("#title").text(response.nama_kos);
  //     // $(".nama_kos").text(response.nama_kos);
  //
  //   },
  //   error:function(error){
  //     console.log("error");
  //   }
  // })
}

function displayDataTable(dataJson){
  // ajax: {
  //   url: "http://localhost:3000/getLaporanPembayaran/"+id_kos,
  //   dataSrc: 'pembayaran_list'
  // },
  $("#table-1").dataTable({
    data: dataJson.pembayaran_list,
    columns: [
      { "data": null,"sortable": false,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        }
      },
      { data: function (data, type, dataToSet) {
          return '<img alt="image" src="'+data.foto+'" class="rounded-circle" width="35" data-toggle="tooltip" title="' +data.nama+ '"> '+data.nama
        }
      },
      { data: function (data, type, dataToSet) {
          return '<td>'+data.durasi+' '+data.tipe_pembayaran+'</td>';
        }
      },
      { data: "kamar"},
      { data: "tanggal_akhir"},
      { data: "total", className: "rupiah"},
      { data: "dibayar", className: "rupiah"},
      { data: "tagihan", className: "rupiah"},
      { data: "status_pembayaran",
        render: function (dataField) {
          return (dataField == "lunas" ? '<center><div class="badge badge-success">Lunas</div></center>'
          : dataField == "angsur" ? '<center><div class="badge badge-warning">Angsur</div></center>'
          : '<center><div class="badge badge-danger">Belum Bayar</div></center>');
        }
      },
      { data: function (data, type, dataToSet) {
          return '<a href="pembayaran?kos='+data.id_kos+'&id=' +data.id_pembayaran+ '" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="lihat"><i class="far fa-eye"></i></a>'+
          ' <button type="submit" class="btn btn-sm btn-danger btn-hapus_pembayaran" data-toggle="tooltip" data-placement="top" title="hapus"><i class="far fa-trash-alt"></i></button>';
        }
      }
    ],
  });
}
