window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const jsonToken = await authToken(token);
  if (jsonToken.User == "member") {
    console.log("ini member");
  } else if (jsonToken.User == "admin") {
    console.log("ini admin");
  } else {
    console.log("ini admin");
  }
}

// function authToken(token){
//   var x = $.ajax({
//     url   : "http://localhost:9000/authToken",
//     type  : 'POST',
//     headers: {"Authorization": "Bearer "+token},
//
//     success: function(response){
//
//     },
//     error:function(error){
//       console.log("ini guest");
//     }
//   })
//   return x;
// }
