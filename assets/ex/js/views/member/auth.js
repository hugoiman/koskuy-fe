var domain = "http://localhost:8000";

function authToken(token){
  var x = $.ajax({
    url   : domain+"/authToken",
    type  : 'POST',
    headers: {"Authorization": "Bearer "+token},

    success: function(response){
      if (response.User == "member") {
        getMember(response.Id_user, token);
        console.log("ini member");
      } else {
        console.log("Unauthorized!");
      }
    },
    error:function(error){
      console.log("error");
    }
  })
  return x;
}

function getMember(id_member, token) {
  var data = $.ajax({
    url   : domain+"/member/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      $("#id_member").val(response.id_member);
      $("#username").val(response.username);
      $('#nama').val(response.nama);
      $('#email').val(response.email);
      $('#no_hp').val(response.no_hp);
      $('#tanggal_lahir').val(response.tanggal_lahir);
      $('#alamat').val(response.alamat);
      $('#jenis_kelamin').val(response.jenis_kelamin);
      $('#nav_nama').text(response.nama);
      $("#profil").attr("href", "/profil/"+response.username);
      $(".avatar").attr("src", response.foto);
    },
    error:function(error){
      console.log("error");
    }
  })
  return data;
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
