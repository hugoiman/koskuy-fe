window.onload = function () {
  var token  = Cookies.get("cookie_token");
  var id_kos = getUrlParameter('kos');
  getData(token, id_kos);
}

const getData = async (token, id_kos) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(id_kos, jsonToken.Id_user, token);
}

function getComponentUI(){
  $(".dashboard").addClass("active");
  $("#page_name").text("Dashboard");
  var button = '<a href="/form-pembayaran" class="btn btn-primary"><i class="fa fa-plus-circle"></i> Data Pembayaran</a> ';
  $(".section-header-button").append(button);
}
