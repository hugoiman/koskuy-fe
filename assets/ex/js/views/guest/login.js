function login(e){
  e.preventDefault();
  var id = $("#id").val();
  var password = $("#password").val();

  var jsonData  =  JSON.stringify({
    id, password
  });

  if (id != "" && password != "") {
    $.ajax({
      url  : "http://localhost:8000/login",
      type : 'POST',
      data : jsonData,
      contentType: 'application/json',
      success:function(response) {
        if (response.status == "Unauthorized") {
          $("#password").val("");
          swalert('warning','Wrong!', 'Maaf username/password salah! Silahkan coba lagi.');
        } else {
          console.log(response);
          swalert('success','Success!', 'Anda telah login.');
          //set cookie
          Cookies.set('cookie_token', response.token, { expires: 7, path: '/' });
          window.location.href = "http://localhost:9000/home";
        }
      },
      error:function(error){
        swalert('error','Oops!', 'Terjadi error');
      }
    });
  } else if (id == "" && password == "") {
    $('.invalid-feedback').show();
  } else if (id == "") {
    $('.invalid-id').show();
  } else if (password == "") {
    $('.invalid-password').show();
  }
}
function authToken(token){
  $.ajax({
    url   : "http://localhost:8000/authToken",
    type  : 'POST',
    headers: {"Authorization": "Bearer "+token},

    // data  : {'username':username},
    success: function(response){
      window.location.href = "/";
    },
    error:function(error){
      console.log("error");
    }
  })
}
