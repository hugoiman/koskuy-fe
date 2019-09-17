window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const getCUI     = await getComponentUI();
  const jsonToken  = await authToken(token);
  // const getDataMember = await getMember(jsonToken.Id_user, token);
}

function getComponentUI(){
  $("#page_name").text("Home");
  $("#title").text("Home");
}
