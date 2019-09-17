window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const getCUI     = await getComponentUI();
  const jsonToken = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
}

function getComponentUI(){
$("#title").text("Form Data Iklan Kos");
}

function validasi_form1() {
  var nama_kos       = $("#nama_kos").val();
  var alamat         = $("#alamat").val();
  var tipe_kos       = $('input[name="tipe_kos"]:checked').val();
  var luas_kamar     = $("#luas_kamar").val();
  var total_kamar    = $("#total_kamar").val();
  var harga_bulanan  = $("#harga_bulanan").val();
  var harga_harian   = $("#harga_harian").val();
  var harga_mingguan = $("#harga_mingguan").val();
  var harga_tahunan  = $("#harga_tahunan").val();
  // console.log(nama_kos, alamat, tipe_kos, luas_kamar,total_kamar, harga_bulanan);

  // validasi_nama_kos(nama_kos);
  // validasi_alamat(alamat);
  // validasi_tipe_kos();
  // validasi_luas_kamar(luas_kamar);
  // validasi_total_kamar(total_kamar);
  // validasi_harga_bulanan(harga_bulanan);

  if ($(".is-invalid").is(":visible")) {
    swalert('warning','Terjadi Kesalahan', 'Silahkan periksa kembali data diri anda.');
  } else {
    $("#fasilitas").addClass("wizard-step-active");
    $("#data_kos").removeClass("wizard-step-active");
    $("#form1").hide();
    $("#form2").show();
    $('html,body').animate({scrollTop:$('.main-content').offset().top}, 600);
  }
}

function validasi_form2() {
  $("#foto").addClass("wizard-step-active");
  $("#fasilitas").removeClass("wizard-step-active");
  $("#form2").hide();
  $("#form3").show();
  $('html,body').animate({scrollTop:$('.main-content').offset().top}, 600);
}

function validasi_nama_kos(nama_kos) {
  if (nama_kos.length != "") {
    $("#nama_kos").removeClass("is-invalid");
    $("#invalid_nama_kos").hide();
  } else {
    $("#nama_kos").addClass("is-invalid");
    $("#invalid_nama_kos").show().text("Nama kos wajib diisi.");
  }
}

function validasi_alamat(alamat) {
  if (alamat.length != "") {
    $("#alamat").removeClass("is-invalid");
    $("#invalid_alamat").hide();
  } else {
    $("#alamat").addClass("is-invalid");
    $("#invalid_alamat").show().text("Alamat kos wajib diisi.");
  }
}

function validasi_tipe_kos() {
  if ($('input[name="tipe_kos"]').is(':checked')) {
    $("#tipe").removeClass("is-invalid");
    $("#invalid_tipe_kos").hide();
  } else {
    $("#tipe").addClass("is-invalid");
    $("#invalid_tipe_kos").show().text("Tipe kos wajib dipilih.");
  }
}

function validasi_luas_kamar(luas_kamar) {
  if (luas_kamar != "") {
    $("#luas_kamar").removeClass("is-invalid");
    $("#invalid_luas_kamar").hide();
  } else {
    $("#luas_kamar").addClass("is-invalid");
    $("#invalid_luas_kamar").show().text("Luas kamar wajib dipilih.");
  }
}

function validasi_total_kamar(total_kamar) {
  if (total_kamar != "") {
    $("#total_kamar").removeClass("is-invalid");
    $("#invalid_total_kamar").hide();
  } else {
    $("#total_kamar").addClass("is-invalid");
    $("#invalid_total_kamar").show().text("Total kamar wajib dipilih.");
  }
}

function validasi_harga_bulanan(harga_bulanan) {
  if (harga_bulanan.length != "") {
    $("#harga_bulanan").removeClass("is-invalid");
    $("#invalid_harga_bulanan").hide();
  } else {
    $("#harga_bulanan").addClass("is-invalid");
    $("#invalid_harga_bulanan").show().text("Harga bulanan wajib diisi.");
  }
}
