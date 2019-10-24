window.onload = function () {
  var token  = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getHistori    = await getHistoriPembayaran(token, jsonToken.Id_user);
}

function getComponentUI(){
  $("#page_name").text("Histori Pembayaran");
  $("#title").text("Histori Pembayaran");
}

function getHistoriPembayaran(token, id_member){
  $.ajax({
    url   : domain+"/history-pembayaran/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      console.log(response);
      displayDataTable(response);

      $(".rupiah").mask('000.000.000', {reverse: true});
      $(".total").text("Total Pembayaran");$(".tagihan").text("Tagihan");$(".dibayar").text("Telah Dibayar");
    }, error:function(error){
      console.log("error");
    }
  })
}

function displayDataTable(dataJson){
  $("#table-1").dataTable({
    data: dataJson.history_pembayaran,
    columns: [
      { data : "nama_kos"},
      { data:
        function (data, type, dataToSet) {
            return '<td>#'+data.id_pembayaran+'</td>';
          }
      },
      { data:
        function (data, type, dataToSet) {
            return '<td>'+data.tanggal_masuk+' - '+data.tanggal_akhir+'</td>';
          }
      },
      { data: "total_pembayaran", className: "rupiah"},
      { data: "total_dibayar", className: "rupiah"},
      { data: "tagihan", className: "rupiah"},
      { data: "status_pembayaran",
        render: function (dataField) {
          return (dataField == "Lunas" ? '<center><div class="badge badge-success">Lunas</div></center>'
          : dataField == "Angsur" ? '<center><div class="badge badge-warning">Angsur</div></center>'
          : '<center><div class="badge badge-danger">Belum Bayar</div></center>');
        }
      },
      { data: function (data, type, dataToSet) {
          return '<a href="/invoice-pembayaran?invoice=' +data.id_pembayaran+ '" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="lihat"><i class="far fa-eye"></i></a>';
          // ' <button type="submit" class="btn btn-sm btn-danger btn-hapus_pembayaran" data-toggle="tooltip" data-placement="top" title="hapus"><i class="far fa-trash-alt"></i></button>';
        }
      }
    ],
  });
}
