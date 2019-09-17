function forgot_password(){
  var email     = $("#email").val();

  $.ajax({
    url  : "http://localhost:9000/forgot-password",
    type : 'POST',
    data : {'email':email},
    success:function(response) {
      if (response == "true") {
        $(".email").removeClass("is-valid");
        $("#email").val("");
        swalert('success','Sukses!', 'Terimakasih! Silahkan periksa email anda.');
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

  if (regex.test(email)) {
    $.ajax({
      url   : "http://localhost:9000/checkEmail",
      type  : 'POST',
      data  : {"email": email},
      success: function(response){
        if (response == "false") {
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
