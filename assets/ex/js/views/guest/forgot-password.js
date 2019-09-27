var domain = "http://localhost:8000";

function forgot_password(){
  var email     = $("#email").val();

  var jsonData  =  JSON.stringify({
    email
  });

  $.ajax({
    url  : domain+"/forgot-password",
    type : 'POST',
    data : jsonData,
    contentType: 'application/json',
    success:function(response) {
      if (response.status == true) {
        $(".email").removeClass("is-valid");
        $("#email").val("");
        swalert('success','Sukses!', 'Terimakasih! Silahkan periksa email anda.');
      } else {
        $("#email").addClass("is-invalid");
        $("#email").removeClass("is-valid");
        swalert('warning','Terjadi Kesalahan!', 'Email Tidak Terdaftar!');
      }
    },
    error:function(error){
      swalert('error','Oops!', 'Terjadi error');
    }
  });
}

function checkEmail() {
  var email = $('#email').val();
  var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  var id_member = 0;

  var jsonData  =  JSON.stringify({
    id_member, email
  });

  if (regex.test(email)) {
    $.ajax({
      url   : domain+"/checkEmail",
      type  : 'POST',
      data  : jsonData,
      contentType: 'application/json',
      success: function(response){
        if (response.status == false) {
          $(".email").addClass("is-valid");
          $(".email").removeClass("is-invalid");
          $("#invalid_email").hide();
        } else {
          $("#email").addClass("is-invalid");
          $("#email").removeClass("is-valid");
          $("#invalid_email").show().text("Email tidak terdaftar!");
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
