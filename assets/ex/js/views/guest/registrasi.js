function registrasi(){
  var nama      = $("#nama").val();
  var username  = $("#username").val();
  var email     = $("#email").val();
  var password  = $("#password").val();

  var jsonData  =  JSON.stringify({
    nama, username, email, password
  });

  $.ajax({
    url  : "http://localhost:8000/member",
    type : 'POST',
    data : jsonData,
    contentType: 'application/json',
    success:function(response) {
      if (response.status == true) {
        swalert('success','Sukses!', 'Registrasi kamu berhasil!');
        setTimeout(function (e) {
          login();
        }, 2500);
      } else {
        swalert('warning','Terjadi Kesalahan!', 'Silahkan lengkapi isi form registrasi.');
      }
    },
    error:function(error){
      swalert('error','Oops!', 'Terjadi error');
    }
  });
}

function login(){
  var id        = $("#email").val();
  var password  = $("#password").val();

  $.ajax({
    url  : "http://localhost:8000/login",
    type : 'POST',
    data : {'id':id,'password':password},
    success:function(response) {
      authToken(response);
    },
    error:function(error){
      swalert('error','Oops!', 'Terjadi error');
    }
  });
}

function authToken(token){
  $.ajax({
    url   : "http://localhost:8000/authToken",
    type  : 'POST',
    headers: {"Authorization": "Bearer "+token},

    // data  : {'username':username},
    success: function(response){
      console.log("oi");
      window.location.href = "/";
    },
    error:function(error){
      console.log("error");
    }
  })
}

function checkUsername(){
  var username = $('#username').val();
  var id_member = 0;
  var regex = /^[a-z0-9_.]{4,18}$/i;

  var jsonData  =  JSON.stringify({
    id_member, username
  });

  if (regex.test(username)) {
    $.ajax({
      url   : "http://localhost:8000/checkUsername",
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
          $("#invalid_username").show().text("Username sudah digunakan.");
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

function checkEmail() {
  var email = $('#email').val();
  var id_member = 0;
  var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  var jsonData  =  JSON.stringify({
    id_member, email
  });

  if (regex.test(email)) {
    $.ajax({
      url   : "http://localhost:8000/checkEmail",
      type  : 'POST',
      data  : jsonData,
      contentType: 'application/json',

      success: function(response){
        if (response.status == true) {
          $(".email").addClass("is-valid");
          $(".email").removeClass("is-invalid");
          $("#invalid_email").hide();
        } else {
          $("#email").addClass("is-invalid");
          $("#email").removeClass("is-valid");
          $("#invalid_email").show().text("Email sudah digunakan.");
        }
      },
      error:function(error){
        console.log("error");
      }
    })
  } else {
    $("#email").addClass("is-invalid");
    $("#email").removeClass("is-valid");
    $("#invalid_email").show().text("Email tidak valid!");
  }
}

function checkNama(){
  var nama = $('#nama').val();
  var regex = /^[a-z ]{1,}$/i;

  if (regex.test(nama)) {
    $(".nama").addClass("is-valid");
    $(".nama").removeClass("is-invalid");
    $("#invalid_nama").hide();
  } else {
    $(".nama").addClass("is-invalid");
    $(".nama").removeClass("is-valid");
    $("#invalid_nama").show().text("Nama wajib diisi dan tidak terdiri dari angka dan karakter khusus.");
  }
}

function checkPassword(){
  var password = $('#password').val();
  var regex = /^[a-z0-9_#$^+=!*()@%&]{6,20}$/i;

  if (regex.test(password)) {
    $(".password").addClass("is-valid");
    $(".password").removeClass("is-invalid");
    $("#invalid_password").hide();
  } else {
    $(".password").addClass("is-invalid");
    $(".password").removeClass("is-valid");
    $("#invalid_password").show().text("Password harus 6-20 karakter");
  }
}

function checkPassword2(){
  var password = $('#password').val();
  var password2 = $('#password2').val();

  if (password == password2 && password2 != "") {
    $(".password2").addClass("is-valid");
    $(".password2").removeClass("is-invalid");
    $("#invalid_password2").hide();
  } else {
    $(".password2").addClass("is-invalid");
    $(".password2").removeClass("is-valid");
    $("#invalid_password2").show().text("Konfirmasi password tidak sesuai dengan password");
  }
}
