window.onload = function () {
  var token = Cookies.get("cookie_token");
  var id_kos = getUrlParameter('kos');
  var id_renter = getUrlParameter('anak-kos');
  getData(token, id_kos, id_renter);
}

const getData = async (token, id_kos, id_renter) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(id_kos, jsonToken.Id_user, token); // wajib
  const getRenter     = await getProfilRenter(id_renter, token);
}

function getComponentUI(){
  $(".daftar-renter").addClass("active");
  $("#page_name").text("Profil Anak Kos");
  $("#title").text("Profil Anak Kos");
}

function getProfilRenter(id_renter, token){
  $.ajax({
    url   : domain+"/anak-kos/"+id_renter,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      console.log(response);
      // $(".id_renter").val(response.id_renter);
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
  })
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
