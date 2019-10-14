window.onload = function () {
  var token = Cookies.get("cookie_token");
  var slug = getUrlParameter('kos');
  getData(token, slug);
}

const getData = async (token, slug) => {
  const getCUI        = await getComponentUI();
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(slug, jsonToken.Id_user, token); // wajib
  // const getPengaturan = await getDaftarRenter(getDataMyKos.id_kos, jsonToken.Id_user, token);
}

function getComponentUI(){
  $(".pengaturan").addClass("active");
  $("#page_name").text("Pengaturan");
  $("#title").text("Pengaturan");
}
