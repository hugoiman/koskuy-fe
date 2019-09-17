window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
}

function getComponentUI(){
  $(".daftar-renter").addClass("active");
  $("#page_name").text("Daftar Anak Kos");
  $("#title").text("Daftar Anak Kos");
  var button = '<button id="add_member" class="btn btn-primary"><i class="fa fa-user-plus"></i> Anak Kos</a> ';
  $(".section-header-button").append(button);
}

// function getDaftarRenter(id_kos){
//   $.ajax({
//     url   : "http://localhost:3000/getDaftarRenter/"+id_kos,
//     type  : 'GET',
//     success: function(response){
//       console.log(response);
//       $("#title").text(response.nama_kos);
//       $(".nama_kos").text(response.nama_kos);
//
//     },
//     error:function(error){
//       console.log("error");
//     }
//   })
// }
