window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  $("#page_name").text("My Profil");

  var url_username  = window.location.pathname.slice(8, );
  const jsonToken = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);

  if (url_username == getDataMember.username) {
    $("#main").removeAttr('hidden');
    const getProfil = await getProfilMember(url_username, token);
  }
  else if(url_username != getDataMember.username) {
    $("#error404").removeAttr('hidden');
  }
}

function getProfilMember(id_member, token){
  $.ajax({
    url   : domain+"/member/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      // $(".id_member").val(response.id_member);
      $(".username").val(response.username);
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

      if (response.verifikasi_email == true) {
        $('#unverified_email').hide();
      } else if (response.verifikasi_email == false) {
        $('#verified_email').hide();
      }

      if (response.verifikasi_no_hp == true) {
        $('#unverified_no_hp').hide();
      } else if (response.verifikasi_no_hp == false) {
        $('#verified_no_hp').hide();
      }

      if (response.verifikasi_password == true) {
        $('#form_password_lama').show();
      } else if (response.verifikasi_password == false) {
        $('#form_password_lama').hide();
      }

      $("#title").text(response.nama);
    },
    error:function(error){
      console.log("error");
    }
  })
}

function checkPasswordLama(){
  var password_lama = $('#password_lama').val();
  var regex = /^[a-z0-9_#$^+=!*()@%&]{6,20}$/i;

  if (regex.test(password_lama)) {
    $("#password_lama").addClass("is-valid");
    $("#password_lama").removeClass("is-invalid");
    $("#invalid_password_lama").hide();
  } else {
    $("#password_lama").addClass("is-invalid");
    $("#password_lama").removeClass("is-valid");
    $("#invalid_password_lama").show().text("Password harus 6-20 karakter");
  }
}

function checkPasswordBaru(){
  var password_baru = $('#password_baru').val();
  var regex = /^[a-z0-9_#$^+=!*()@%&]{6,20}$/i;

  if (regex.test(password_baru)) {
    $("#password_baru").addClass("is-valid");
    $("#password_baru").removeClass("is-invalid");
    $("#invalid_password_baru").hide();
  } else {
    $("#password_baru").addClass("is-invalid");
    $("#password_baru").removeClass("is-valid");
    $("#invalid_password_baru").show().text("Password harus 6-20 karakter");
  }
}

function checkKonfirmasiPassword(){
  var password_baru = $('#password_baru').val();
  var konfirmasi_password = $('#konfirmasi_password').val();

  if (password_baru == konfirmasi_password) {
    $("#konfirmasi_password").addClass("is-valid");
    $("#konfirmasi_password").removeClass("is-invalid");
    $("#invalid_konfirmasi_password").hide();
  } else {
    $("#konfirmasi_password").addClass("is-invalid");
    $("#konfirmasi_password").removeClass("is-valid");
    $("#invalid_konfirmasi_password").show().text("Konfirmasi password tidak sesuai dengan password");
  }
}

function changePassword(){
  var token = Cookies.get("cookie_token");
  var id_member = $("#id_member").val();
  var password_lama = $("#password_lama").val();
  var password_baru = $("#password_baru").val();
  var konfirmasi_password = $("#konfirmasi_password").val();

  var jsonData  =  JSON.stringify({
    password_lama, password_baru
  });

  $.ajax({
    url   : domain+"/password/"+id_member,
    type  : 'PUT',
    headers: {"Authorization": "Bearer "+token},
    data : jsonData,
    contentType: 'application/json',
    success: function(response){
      if (response.status == true) {
        swalert('success','Sukses', 'Berhasil ubah password.');
        setTimeout(function () {
  				location.reload();
  			}, 2500);
      } else {
        swalert('warning','Terjadi Kesalahan', 'Password lama tidak sesuai.');
      }
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

function checkUsername(){
  var id_member = parseInt($("#id_member").val());
  var username = $('#input_username').val();
  var token = Cookies.get("cookie_token");
  var regex = /^[a-z0-9_.]{4,18}$/i;

  var jsonData  =  JSON.stringify({
    id_member, username
  });

  if (regex.test(username)) {
    $.ajax({
      url   : domain+"/checkUsername",
      type  : 'POST',
      data : jsonData,
      contentType: 'application/json',

      success: function(response){
        if (response.status == true) {
          $(".username").addClass("is-valid");
          $(".username").removeClass("is-invalid");
          $("#invalid_username").hide();
        } else {
          $(".username").addClass("is-invalid");
          $(".username").removeClass("is-valid");
          $("#invalid_username").show().text("Username sudah digunakan");
        }
      },
      error:function(error){
        console.log("error");
      }
    })
  } else {
    $(".username").addClass("is-invalid");
    $(".username").removeClass("is-valid");
    $("#invalid_username").show().text("Username harus 4-18 karakter dan tidak terdiri dari spasi dan karakter khusus.");
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

  $("#input_username").val($("#username").val());
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
  var id_member = parseInt($("#id_member").val());
  var nama = $("#input_nama").val();
  var username = $("#input_username").val();
  var tanggal_lahir = moment($("#input_tanggal_lahir").val(), "DD MMM YYYY").format("YYYY-MM-DD");
  var jenis_kelamin = $("input[name=gender]:checked").val();
  var alamat = $("#input_alamat").val();

  var data  =  JSON.stringify({
    nama, username, tanggal_lahir, jenis_kelamin, alamat
  });

  $.ajax({
    url   : domain+"/member/"+id_member,
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

function btnSimpanEmail(){
  var token = Cookies.get("cookie_token");
  var id_member = $("#id_member").val();
  var email = $("#input_email").val();
  var nama  = $("#input_nama").val();
  var username  = $("#input_username").val();
  var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  console.log(email);

  if (regex.test(email)) {
    $.ajax({
      url   : domain+"/editEmail",
      type  : 'POST',
      data  : {"email": email, "id_member": id_member, "nama": nama, "username": username},
      headers: {"Authorization": "Bearer "+token},
      success: function(response){
        if (response == "true") {
          $("#input_email").addClass("is-valid");
          $("#input_email").removeClass("is-invalid");
          $("#btnOkEmail").show();
          $("#btnBatalEmail").addClass("btn-primary").text("OK");
          $("#btnSimpanEmail").hide();
          $("#invalid_email").show().text("Link konfirmasi telah kami kirim ke email anda. Silahkan periksa email anda.");
        } else {
          $("#input_email").addClass("is-invalid");
          $("#input_email").removeClass("is-valid");
          $("#invalid_email").show().text("Email sudah digunakan. Silahkan coba email lain.");
        }
      },
      error:function(error){
        console.log("error");
      }
    })
  } else {
    $("#input_email").addClass("is-invalid");
    $("#input_email").removeClass("is-valid");
    $("#invalid_email").show().text("Email tidak valid!");
  }
}
