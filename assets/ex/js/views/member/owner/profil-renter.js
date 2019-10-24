window.onload = function () {
  var token = Cookies.get("cookie_token");
  var uri   = new URI(window.location.href);
  var slug  = uri.segment(1); //  slug renter
  getData(token, slug);
}

const getData = async (token, slug) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getRenter     = await getProfilRenter(slug, token);
  const getDataMyKos  = await getMyKos(getRenter.id_kos, jsonToken.Id_user, token); // wajib
  const getHistori    = await getHistoriPembayaran(token, getRenter.id_renter);
}

function getComponentUI(){
  $(".daftar-renter").addClass("active");
  $("#page_name").text("Profil Anak Kos");
  $("#title").text("Profil Anak Kos");
}

function getProfilRenter(slug, token){
  var output = $.ajax({
    url   : domain+"/anak-kos/"+slug,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      console.log(response);
      // $(".slug").val(response.slug);
      $(".kamar").text(response.kamar);
      $(".nama").val(response.nama);
      $('.email').val(response.email);
      $('.no_hp').val(response.no_hp);
      if (response.tanggal_lahir != "01 Jan 0001") {
        $('.tanggal_lahir').val(response.tanggal_lahir);
      } else if (response.tanggal_lahir == "01 Jan 0001") {
        $('.tanggal_lahir').val("");
      }
      $('.jenis_kelamin').val(response.jenis_kelamin);
      $('.pekerjaan').val(response.pekerjaan);
      $('.alamat').val(response.alamat);
      $('.foto').val(response.foto);

      var strfoto = response.foto.split("/");
      str4 = strfoto[strfoto.length-1];
      str3 = strfoto[strfoto.length-2];
      str2 = strfoto[strfoto.length-3];
      str1 = strfoto[strfoto.length-4];
      var foto = str1+"/"+str2+"/"+str3+"/"+str4;

      $(".avatar_profil").attr("src", "https://res.cloudinary.com/dbddhr9rz/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/"+foto);
      if (response.jenis_kelamin == "pria") {
        $('.pria').prop("checked", true);
      } else if (response.jenis_kelamin == "wanita") {
        $('.wanita').prop("checked", true);
      }

      $("#title").text(response.nama);
    },
    error:function(error){
      console.log("error");
    }
  });
  return output;
}

function checkNama(){
  var nama = $('#input_nama').val();
  var regex = /^[a-z0-9 ]{1,}$/i;

  if (regex.test(nama)) {
    $(".nama").addClass("is-valid");
    $(".nama").removeClass("is-invalid");
    $("#invalid_nama").hide();
  } else {
    $(".nama").addClass("is-invalid");
    $(".nama").removeClass("is-valid");
    $("#invalid_nama").show().text("Nama wajib diisi dan tidak terdiri dari karakter khusus.");
  }
}

function btnUbahBiodata(){
  $("#btnUbahBiodata").hide();
  $("#btnSimpanBiodata").show();
  $("#btnBatalBiodata").show();

  $(".biodata").prop('readonly', false);
  $(".gender").prop('disabled', false);

  $("#input_tanggal_lahir").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
      format: 'DD MMM YYYY'
    }
  });
}

function btnBatalBiodata(){
  $("#btnUbahBiodata").show();
  $("#btnSimpanBiodata").hide();
  $("#btnBatalBiodata").hide();
  $(".biodata").removeClass("is-valid");
  $(".username").removeClass("is-invalid");

  $(".biodata").prop('readonly', true);
  $(".gender").prop('disabled', true);
  $("#input_tanggal_lahir").data('daterangepicker').remove();

  $("#input_nama").val($("#nama").val());
  $("#input_tanggal_lahir").val($("#tanggal_lahir").val());
  $("#input_alamat").val($("#alamat").val());
  if ($("#jenis_kelamin").val() == "pria") {
    $(".pria").prop("checked", true);
  } else if ($("#jenis_kelamin").val() == "wanita") {
    $(".wanita").prop("checked", true);
  }
}

function btnSimpanBiodata(){
  var token = Cookies.get("cookie_token");
  var id_renter = parseInt($("#id_renter").val());
  var nama = $("#input_nama").val();
  var tanggal_lahir = moment($("#input_tanggal_lahir").val(), "DD MMM YYYY").format("YYYY-MM-DD");
  var jenis_kelamin = $("input[name=gender]:checked").val();
  var alamat = $("#input_alamat").val();

  var data  =  JSON.stringify({
    nama, username, tanggal_lahir, jenis_kelamin, alamat
  });

  $.ajax({
    url   : domain+"/member/"+id_renter,
    type  : 'PUT',
    data  : data,
    contentType: 'application/json',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      if (response.status == true) {
        swalert('success','Sukses!', 'Berhasil edit biodata.');
        setTimeout(function () {
  				location.reload();
  			}, 2500);
      } else {
        swalert('warning','Terjadi Kesalahan!', 'Gagal edit biodata.');
      }
    },
    error:function(error){
      console.log("error");
    }
  })
}

function getHistoriPembayaran(token, id_renter){
  $.ajax({
    url   : domain+"/history-pembayaran/"+id_renter,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      displayDataTable(response);

      $(".rupiah").mask('000.000.000', {reverse: true});
      $(".total").text("Total");$(".tagihan").text("Tagihan");$(".dibayar").text("Telah Dibayar");
    }, error:function(error){
      console.log("error");
    }
  })
}

function displayDataTable(dataJson){
  $("#table-1").dataTable({
    data: dataJson.pembayaran_list,
    columns: [
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
          return (dataField == "lunas" ? '<center><div class="badge badge-success">Lunas</div></center>'
          : dataField == "angsur" ? '<center><div class="badge badge-warning">Angsur</div></center>'
          : '<center><div class="badge badge-danger">Belum Bayar</div></center>');
        }
      },
      { data: function (data, type, dataToSet) {
          return '<a href="/pembayaran?invoice=' +data.id_pembayaran+ '" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="lihat"><i class="far fa-eye"></i></a>';
          // ' <button type="submit" class="btn btn-sm btn-danger btn-hapus_pembayaran" data-toggle="tooltip" data-placement="top" title="hapus"><i class="far fa-trash-alt"></i></button>';
        }
      }
    ],
  });
}
