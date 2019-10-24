window.onload = function () {
  var token  = Cookies.get("cookie_token");
  var slug   = getUrlParameter('kos');
  var strbulan = getUrlParameter('bulan');
  var bulan  = getBulanStringToNumber(getUrlParameter('bulan'));
  var tahun  = getUrlParameter('tahun');
  getData(token, slug, bulan, tahun, strbulan);
}

function getBulanStringToNumber(mon){
  var d = Date.parse(mon + "1, 2012");
  if(!isNaN(d)){
    return new Date(d).getMonth() + 1;
  }

  return -1;
}

const getData = async (token, slug, bulan, tahun, strbulan) => {
  const getCUI        = await getComponentUI(strbulan, tahun, slug);
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(slug, jsonToken.Id_user, token); // wajib
  const getTotalStatus  = await getStatusPembayaran(token, getDataMyKos.id_kos);
  const getLaporan    = await getLaporanPembayaran(token, getDataMyKos.id_kos, bulan, tahun);
}

function getComponentUI(strbulan, tahun, slug){
  $(".laporan").addClass("active");
  $(".laporan-pembayaran").addClass("active");
  $("#page_name").text("Laporan Pembayaran");
  $("#title").text("Laporan Pembayaran");
  $("#date").val(strbulan+" "+tahun);
  var button = '<a href="/pembayaran-baru?kos='+slug+'" class="btn btn-primary" id="add_pembayaran"><i class="fa fa-plus"></i> Pembayaran Baru</a> ';
  $(".section-header-button").append(button);
  // $("#add_pembayaran").attr("href", "/pembayaran-baru?kos="+slug);
}

function getLaporanPembayaran(token, id_kos, bulan, tahun){
  $.ajax({
    url   : domain+"/laporan-pembayaran/"+id_kos+"?bulan="+bulan+"&tahun="+tahun,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      displayDataTable(response);

      var total_pemasukan = 0
      $.each(response.laporan_pembayaran,function(prop,obj){
        total_pemasukan += obj.nominal;
      });

      $(".total-pemasukan").text(total_pemasukan);
      $(".rupiah").mask('000.000.000', {reverse: true});
      $(".total").text("Total"); $(".dibayar").text("Dibayar"); $(".tagihan").text("Tagihan"); $(".nominal").text("Nominal");
      // var total_renter = response.laporan_pembayaran.filter(function(x) { return x; }).length;
      // var total_lunas = response.laporan_pembayaran.filter(function(x) { return x.status_pembayaran == "lunas"; }).length;
      // var total_angsur = response.laporan_pembayaran.filter(function(x) { return x.status_pembayaran == "angsur"; }).length;
      // var total_belum_bayar = response.laporan_pembayaran.filter(function(x) { return x.status_pembayaran == "belum bayar"; }).length;

      // $('#total-renter').text(total_renter);
      // $('#total-lunas').text(total_lunas);
      // $('#total-angsur').text(total_angsur);
      // $('#total-belum_bayar').text(total_belum_bayar);
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
  //   url   : "http://localhost:3000/getLaporanPembayaran/"+slug,
  //   type  : 'GET',
  //   headers: {"Authorization": "Bearer "+token},
  //   success: function(data){
  //     console.log(data);
  //     $("#table-1").find('tbody').empty(); //add this line
  //
  //     $.each(data.laporan_pembayaran, function(idx, value) {
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
  //   url: "http://localhost:3000/getLaporanPembayaran/"+slug,
  //   dataSrc: 'laporan_pembayaran'
  // },
  $("#table-1").dataTable({
    data: dataJson.laporan_pembayaran,
    columns: [
      // { "data": null,"sortable": false,
      //   render: function (data, type, row, meta) {
      //     return meta.row + meta.settings._iDisplayStart + 1;
      //   }
      // },
      { data:
        function (data, type, dataToSet) {
            return '<td>#'+data.id_pembayaran+'</td>';
          }
      },
      { data: function (data, type, dataToSet) {
          return '<img alt="image" src="'+data.foto+'" class="rounded-circle" width="35" data-toggle="tooltip" title="' +data.nama+ '"> '+data.nama
        }
      },
      // { data: function (data, type, dataToSet) {
      //     return '<td>'+data.durasi+' '+data.tipe_pembayaran+'</td>';
      //   }
      // },
      { data: "kamar"},
      { data: "tanggal_pembayaran"},
      { data: "nominal", className: "rupiah"},
      { data: "tanggal_akhir"},
      { data: "total_pembayaran", className: "rupiah"},
      { data: "tagihan", className: "rupiah"},
      { data: "status_pembayaran",
        render: function (dataField) {
          return (dataField == "lunas" ? '<center><div class="badge badge-success">Lunas</div></center>'
          : dataField == "angsur" ? '<center><div class="badge badge-warning">Angsur</div></center>'
          : '<center><div class="badge badge-danger">Belum Bayar</div></center>');
        }
      },
      { data: function (data, type, dataToSet) {
          return '<a href="pembayaran?invoice=' +data.id_pembayaran+ '" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="lihat"><i class="far fa-eye"></i></a>';
          // ' <button type="submit" class="btn btn-sm btn-danger btn-hapus_pembayaran" data-toggle="tooltip" data-placement="top" title="hapus"><i class="far fa-trash-alt"></i></button>';
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
