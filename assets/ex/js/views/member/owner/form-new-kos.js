window.onload = function () {
  var token = Cookies.get("cookie_token");
  getData(token);
}

const getData = async (token) => {
  const getCUI     = await getComponentUI();
  const jsonToken = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getFasilitas = await getAllFasilitas(token);
}

function getComponentUI(){
  $("#title").text("Daftar Iklan Kos");
}

function getAllFasilitas(token) {
  $.ajax({
    url   : "http://localhost:8000/all-fasilitas",
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      $.each(response.all_fasilitas, function(idx, value) {
        if (value.jenis_fasilitas == "Fasilitas Bersama") {
          var data = '<div class="form-check form-check-inline col-3">'+
            '<input class="form-check-input" type="checkbox" id="inlineCheckbox'+value.id_fasilitas+'" value="'+value.id_fasilitas+'">'+
            '<label class="form-check-label" for="inlineCheckbox'+value.id_fasilitas+'">'+value.nama_fasilitas+'</label>'+
          '</div>';

          $("#fasilitas_bersama").append(data);
        } else if (value.jenis_fasilitas == "Fasilitas Kamar") {
          var data = '<div class="form-check form-check-inline col-3">'+
            '<input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">'+
            '<label class="form-check-label" for="inlineCheckbox1">'+value.nama_fasilitas+'</label>'+
          '</div>';

          $("#fasilitas_kamar").append(data);
        } else if (value.jenis_fasilitas == "Fasilitas Kamar Mandi") {
          var data = '<div class="form-check form-check-inline col-3">'+
            '<input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">'+
            '<label class="form-check-label" for="inlineCheckbox1">'+value.nama_fasilitas+'</label>'+
          '</div>';

          $("#fasilitas_kmandi").append(data);
        } else if (value.jenis_fasilitas == "Lingkungan") {
          var data = '<div class="form-check form-check-inline col-3">'+
            '<input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">'+
            '<label class="form-check-label" for="inlineCheckbox1">'+value.nama_fasilitas+'</label>'+
          '</div>';

          $("#fasilitas_area").append(data);
        }
      });
    },
    error:function(error){
      console.log("error");
    }
  })
}

function validasi_form0() {
  var alamat         = $("#alamat_kos").val();
  var lokasi         = $("#map-search").val();

  // validasi_lokasi(lokasi);
  // validasi_alamat(alamat);

  if ($(".is-invalid").is(":visible")) {
    swalert('warning','Terjadi Kesalahan', 'Mohon lengkapi isi form dengan benar.');
  } else {
    $(".wizard-step").removeClass("wizard-step-active");
    $("#data_kos").addClass("wizard-step-active");
    $("#form0").hide();
    $("#form1").show();
    $('html,body').animate({scrollTop:$('.main-content').offset().top}, 600);
  }
}

function validasi_form1() {
  var nama_kos       = $("#nama_kos").val();
  // var alamat         = $("#alamat").val();
  var tipe_kos       = $('input[name="tipe_kos"]:checked').val();
  var luas_kamar     = $("#luas_kamar").val();
  var total_kamar    = $("#total_kamar").val();
  var harga_bulanan  = $("#harga_bulanan").val();
  var harga_harian   = $("#harga_harian").val();
  var harga_mingguan = $("#harga_mingguan").val();
  var harga_tahunan  = $("#harga_tahunan").val();

  // validasi_nama_kos(nama_kos);
  // validasi_tipe_kos();
  // validasi_luas_kamar(luas_kamar);
  // validasi_total_kamar(total_kamar);
  // validasi_harga_bulanan(harga_bulanan);

  if ($(".is-invalid").is(":visible")) {
    swalert('warning','Terjadi Kesalahan', 'Mohon lengkapi isi form dengan benar.');
  } else {
    $(".wizard-step").removeClass("wizard-step-active");
    $("#fasilitas").addClass("wizard-step-active");
    $("#form1").hide();
    $("#form2").show();
    $('html,body').animate({scrollTop:$('.main-content').offset().top}, 600);
  }
}

function validasi_form2() {
  var atLeastOneIsChecked = $('.form-check-input').is(':checked');
  if (atLeastOneIsChecked == 0) {
    swalert('warning','Terjadi Kesalahan', 'Pilih fasilitas setidaknya satu.');
  } else {
    $(".wizard-step").removeClass("wizard-step-active");
    $("#foto").addClass("wizard-step-active");
    $("#form2").hide();
    $("#form3").show();
    $('html,body').animate({scrollTop:$('.main-content').offset().top}, 600);
  }
}

//Form0
function validasi_lokasi(lokasi) {
  if (lokasi.length != "") {
    $("#map-search").removeClass("is-invalid");
    $("#invalid_lokasi").hide();
  } else {
    $("#map-search").addClass("is-invalid");
    $("#invalid_lokasi").show().text("Silahkan isi bagian ini.");
  }
}

function validasi_alamat(alamat) {
  if (alamat.length != "") {
    $("#alamat").removeClass("is-invalid");
    $("#invalid_alamat").hide();
  } else {
    $("#alamat").addClass("is-invalid");
    $("#invalid_alamat").show().text("Silahkan isi bagian ini.");
  }
}

function validasi_nama_kos(nama_kos) {
  var regex = /^[a-z0-9]{5,50}$/i;
  if (regex.test(nama_kos)) {
    $("#nama_kos").removeClass("is-invalid");
    $("#invalid_nama_kos").hide();
  } else {
    $("#nama_kos").addClass("is-invalid");
    $("#invalid_nama_kos").show().text("Nama kos 5-50 karakter dan tidak terdiri dari karakter khusus");
  }
}

function validasi_tipe_kos() {
  if ($('input[name="tipe_kos"]').is(':checked')) {
    $("#tipe").removeClass("is-invalid");
    $("#invalid_tipe_kos").hide();
  } else {
    $("#tipe").addClass("is-invalid");
    $("#invalid_tipe_kos").show().text("Silahkan isi bagian ini.");
  }
}

function validasi_luas_kamar(luas_kamar) {
  if (luas_kamar != "") {
    $("#luas_kamar").removeClass("is-invalid");
    $("#invalid_luas_kamar").hide();
  } else {
    $("#luas_kamar").addClass("is-invalid");
    $("#invalid_luas_kamar").show().text("Silahkan isi bagian ini.");
  }
}

function validasi_total_kamar(total_kamar) {
  if (total_kamar != "") {
    $("#total_kamar").removeClass("is-invalid");
    $("#invalid_total_kamar").hide();
  } else {
    $("#total_kamar").addClass("is-invalid");
    $("#invalid_total_kamar").show().text("Silahkan isi bagian ini.");
  }
}

function validasi_harga_bulanan(harga_bulanan) {
  if (harga_bulanan.length != "") {
    $("#harga_bulanan").removeClass("is-invalid");
    $("#invalid_harga_bulanan").hide();
  } else {
    $("#harga_bulanan").addClass("is-invalid");
    $("#invalid_harga_bulanan").show().text("Silahkan isi bagian ini.");
  }
}
