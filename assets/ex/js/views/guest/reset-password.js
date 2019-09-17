function reset_password(){
  var token = getUrlParameter('token');
  var password  = $("#password").val();

  $.ajax({
    url  : "http://localhost:9000/reset-password",
    type : 'POST',
    data : {'password':password},
    headers: {"Authorization": "Bearer "+token},
    success:function(response) {
      if (response == "true") {
        $(".email").removeClass("is-valid");
        $("#email").val("");
        swalert('success','Sukses!', 'Berhasil reset password!');

        setTimeout(function () {
  				window.location.href = "http://localhost:9000/";
  			}, 2500);
      }
    },
    error:function(error){
      swalert('error','Oops!', 'Your token is invalid or expired');
    }
  });
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
};
