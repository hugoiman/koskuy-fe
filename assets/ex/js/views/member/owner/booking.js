window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getbooking    = await getBookingList(jsonToken.Id_user, token);
}

function getComponentUI(){
  $(".booking").addClass("active");
  $("#page_name").text("Permintaan Booking");
  $("#title").text("Permintaan Booking");
  var button = '<button id="add_member" class="btn btn-primary"><i class="fa fa-user-plus"></i> Anak Kos</a> ';
}

function getBookingList(id_member, token){
  $.ajax({
    url   : "http://localhost:8000/booking/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      displayDataTable(response, token);
      // console.log(response);
    },
    error:function(error){
      console.log("error");
    }
  })
}

function displayDataTable(dataJson, token) {
  $("#table-1").dataTable({
    data: dataJson.booking_list,
    columns: [
      { "data": null,"sortable": false,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        }
      },
      { data: function (data, type, dataToSet) {
          return '<a href="#" onclick= modal_booking("'+token+'","'+data.status_booking+'","'+data.id_booking+'","'+encodeURIComponent(data.data_member[0].nama)+'","'+data.data_member[0].email+'","'+data.data_member[0].no_hp+'","'+data.data_member[0].jenis_kelamin+'","'+
          encodeURIComponent(data.data_member[0].alamat)+'","'+data.data_member[0].foto+'","'+encodeURIComponent(data.data_member[0].tanggal_lahir)+'") class="btn" id="modal-2"><img alt="image" src="'+data.data_member[0].foto+'" class="rounded-circle" width="35" data-toggle="tooltip" title="'+
          data.data_member[0].nama+'"> '+data.data_member[0].nama+'</a>';
        }
      },
      { data: "nama_kos"},
      { data: function (data, type, dataToSet) {
          return '<td>'+data.durasi+' '+data.tipe_pembayaran+'</td>';
        }
      },
      { data: "tanggal_awal"},
      { data: "tanggal_akhir"},
      { data: "status_booking",
        render: function (dataField) {
          return (dataField == "disetujui" ? '<center><div class="badge badge-success">Disetujui</div></center>'
          : dataField == "ditolak" ? '<center><div class="badge badge-danger">Ditolak</div></center>'
          : '<center><div class="badge badge-warning">Menunggu</div></center>');
        }
      },
      { data: function (data, type, dataToSet) {
        return (data.status_booking == "menunggu" ? '<a href="#" class="btn btn-icon btn-primary" data-toggle="tooltip" data-placement="top" title="Setujui" onclick= btnConfirm("'+data.id_booking+'","'+encodeURIComponent(data.data_member[0].nama)+'","'+token+'","disetujui")><i class="fa fa-check"></i></a>'+
        ' <a href="#" class="btn btn-icon btn-danger" data-toggle="tooltip" data-placement="top" title="Tolak" onclick= btnConfirm("'+data.id_booking+'","'+encodeURIComponent(data.data_member[0].nama)+'","'+token+'","ditolak")><i class="fa fa-times"></i></a>'
        : '<a href="#" class="btn btn-icon btn-primary disabled" data-toggle="tooltip" data-placement="top" title="Setujui"><i class="fa fa-check"></i></a>'+
        ' <a href="#" class="btn btn-icon btn-danger disabled" data-toggle="tooltip" data-placement="top" title="Tolak"><i class="fa fa-times"></i></a>')
        }
      }
    ],
  });
}

function modal_booking(token, status_booking, id_booking, nama, email, no_hp, jenis_kelamin, alamat, foto, tanggal_lahir){
  // console.log(id_booking, nama, email, no_hp, jenis_kelamin, alamat, foto, tanggal_lahir);
  var nama2 = nama.replace(/%20/g, " ");
  var alamat2 = alamat.replace(/%20/g, " ");
  var tanggal_lahir2 = tanggal_lahir.replace(/%20/g, " ");

  Swal.fire({
    title: '<strong>'+nama2+'</strong>',
    imageUrl: foto,
    imageWidth: 100,
    imageHeight: 100,
    imageAlt: 'Custom image',
    showCloseButton: true,
    showConfirmButton: false,
    html:
      '<p>Email: <b>'+ email+'</b></p>' +
      '<p>No HP: <b>'+ no_hp+'</b></p>' +
      '<div class="col-12 col-sm-12 col-lg-12">'+
        '<div class="author-box-left">'+
          '<img alt="image" src="'+foto+'" class="rounded">'+
          '<div class="clearfix"></div>'+
        '</div>'+
      '</div>'+
      '<div class="modal-footer bg-whitesmoke br">'+
        (status_booking == "menunggu" ?
        '<button type="button" class="btn btn-primary btn-icon" onclick= btnConfirm("'+id_booking+'","'+nama+'","'+token+'","disetujui")><i class="fa fa-check"></i> Setujui</button>'+
        '<button type="button" class="btn btn-danger btn-icon" onclick= btnConfirm("'+id_booking+'","'+nama+'","'+token+'","ditolak")><i class="fa fa-times"></i> Tolak</button>'
        : status_booking == "disetujui" ? '<a href="#" class="btn btn-icon icon-left btn-success"><i class="fas fa-check"></i> Disetujui</a>'
        : '<a href="#" class="btn btn-icon icon-left btn-success"><i class="fas fa-times"></i> Ditolak</a>')+
      '</div>'
  })
}

function btnConfirm(id_booking, nama, token, status_booking) {
  var nama2 = nama.replace(/%20/g, " ");
  var url = domain+"/booking/"+id_booking
  var jsonData  =  JSON.stringify({
    status_booking
  });

  if (status_booking == "disetujui") {
    swalertConfirm('question', 'ingin menerima '+nama2+' sebagai anak kos?', url, jsonData, 'Berhasil!', 'Permintaan booking telah disetujui.','PUT', token)
  } else if (status_booking == "ditolak") {
    swalertConfirm('warning', 'ingin menolak '+nama2+' sebagai anak kos?', url, jsonData, 'Berhasil!', 'Permintaan booking telah ditolak.','PUT', token)
  }
}
