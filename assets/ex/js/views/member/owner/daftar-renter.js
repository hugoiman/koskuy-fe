window.onload = function () {
  var token = Cookies.get("cookie_token");
  var id_kos = getUrlParameter('kos');
  getData(token, id_kos);
}

const getData = async (token, id_kos) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(id_kos, jsonToken.Id_user, token); // wajib
  const getDftrRenter = await getDaftarRenter(id_kos, jsonToken.Id_user, token);
}

function getComponentUI(){
  $(".daftar-renter").addClass("active");
  $("#page_name").text("Daftar Anak Kos");
  $("#title").text("Daftar Anak Kos");
  var button = '<button id="add_member" class="btn btn-primary"><i class="fa fa-user-plus"></i> Anak Kos</a> ';
  $(".section-header-button").append(button);
}

function getDaftarRenter(id_kos, id_member, token){
  $.ajax({
    url   : "http://localhost:8000/daftar-anak-kos/"+id_kos,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      displayDataTable(response);
      // $.each(response.renter_list, function(idx, value) {
      //   var data = '<tr>'+
      //     '<td>'+(idx+1)+'</td>'+
      //     '<td>'+
      //       '<img alt="image" src="'+value.foto+'" class="rounded-circle" width="35" data-toggle="tooltip" title="'+value.nama+'"> '+value.nama+
      //     '</td>'+
      //     '<td>'+value.no_hp+'</td>'+
      //     '<td>'+value.jenis_kelamin+'</td>'+
      //     '<td>'+value.kamar+'</td>'+
      //     '<td><center><div class="badge badge-success">'+value.status_renter+'</div></center></td>'+
      //     '<td>'+
      //       '<a href="/profil-anak-kos?kos='+value.id_kos+'&anak-kos='+value.id_renter+'" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="view"><i class="far fa-eye"></i></a>'+
      //       ' <button type="submit" class="btn btn-sm btn-danger btn-hapus_pembayaran" data-toggle="tooltip" data-placement="top" title="hapus"><i class="far fa-trash-alt"></i></button>'+
      //     '</td>'+
      //   '</tr>';
      //   $("#table-1").find('tbody').append(data);
      // });

    },
    error:function(error){
      console.log("error");
    }
  })
}

function displayDataTable(dataJson) {
  $("#table-1").dataTable({
    data: dataJson.renter_list,
    columns: [
      { "data": null,"sortable": false,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        }
      },
      { data: function (data, type, dataToSet) {
          return '<img alt="image" src="'+data.foto+'" class="rounded-circle" width="35" data-toggle="tooltip" title="'+data.nama+'"> '+data.nama
        }
      },
      { data: "no_hp"},
      { data: "jenis_kelamin"},
      { data: "kamar"},
      { data: "status_renter"},
      { data: function (data, type, dataToSet) {
          return '<a href="/profil-anak-kos?kos='+data.id_kos+'&anak-kos='+data.id_renter+'" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="view"><i class="far fa-eye"></i></a>'+
          ' <button type="submit" class="btn btn-sm btn-danger btn-hapus_pembayaran" d;ata-toggle="tooltip" data-placement="top" title="hapus"><i class="far fa-trash-alt"></i></button>';
        }
      }
    ],
  });
}
