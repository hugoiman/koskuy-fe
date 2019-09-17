function authToken(token){
  var x = $.ajax({
    url   : "http://localhost:8000/authToken",
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
    url   : "http://localhost:8000/member/"+id_member,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      $("#id_member").val(response.id_member);
      $("#username").val(response.username);
      $('#nav_nama').text(response.nama);
      $("#profil").attr("href", "/profil/"+response.username);
      $(".avatar").attr("src", "https://res.cloudinary.com/dbddhr9rz/image/upload/v1568697619/koskuy-img/members/"+response.foto);
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
