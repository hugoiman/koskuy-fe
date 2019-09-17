window.onload = function () {
  var token = getUrlParameter('token');
  verifikasi_email(token);
}

function verifikasi_email(token) {
  $.ajax({
    url  : "http://localhost:8000/verifikasi-email",
    type : 'PUT',
    headers: {"Authorization": "Bearer "+token},
    success:function(response) {
      window.location.replace("http://localhost:9000/profil/"+response);
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
