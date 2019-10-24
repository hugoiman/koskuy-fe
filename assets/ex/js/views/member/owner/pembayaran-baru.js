window.onload = function () {
  var token  = Cookies.get("cookie_token");
  var slug   = getUrlParameter('kos');
  getData(token, slug);
}

const getData = async (token, slug) => {
  const getCUI        = await getComponentUI(slug);
  const jsonToken     = await authToken(token);
  const getDataMember = await getMember(jsonToken.Id_user, token);
  const getDataMyKos  = await getMyKos(slug, jsonToken.Id_user, token); // wajib
  const getRenter     = await getDaftarRenter(getDataMyKos.id_kos, jsonToken.Id_user, token);
  const getHargaSewa  = await getHargaSewaKos(getDataMyKos.harga_sewa_list);
}

function getComponentUI(slug){
  $("#page_name").text("Pembayaran Baru");
  $("#title").text("Pembayaran Baru");
}

function getDaftarRenter(id_kos, id_member, token){
  $.ajax({
    url   : "http://localhost:8000/daftar-anak-kos/"+id_kos,
    type  : 'GET',
    headers: {"Authorization": "Bearer "+token},
    success: function(response){
      $.each(response.renter_list, function(idx, value) {
        var data = '<option value="'+value.id_renter+','+value.id_member+'">'+value.nama+'</option>';
        $("#nama_anak_kos").append(data);
      });
    },
    error:function(error){
      console.log("error");
    }
  })
}

function getHargaSewaKos(harga_sewa_list) {
  var data;
  $.each(harga_sewa_list, function(idx, value) {
    if (value.bulanan != 0) {
      data = '<option selected value="30,Bulan,'+value.bulanan+'">Bulan</option>';
      $("#tipe_pembayaran").append(data);
    }

    if (value.harian != 0) {
      data = '<option value="1,Hari,'+value.harian+'">Hari</option>';
      $("#tipe_pembayaran").append(data);
    }

    if (value.mingguan != 0) {
      data = '<option value="7,Minggu,'+value.mingguan+'">Minggu</option>';
      $("#tipe_pembayaran").append(data);
    }

    if (value.tahunan != 0) {
      data = '<option value="365,Tahun,'+value.tahunan+'">Tahun</option>';
      $("#tipe_pembayaran").append(data);
    }
  })
}

function validasi_pembayaran() {
  var id             = $("#nama_anak_kos").val().split(",");

  var id_renter      = parseInt(id[0]);
  var id_member      = parseInt(id[1]);
  var kamar          = $("#kamar").val();
  var durasi         = $("#durasi1").val();
  var tipe_pembayaran= $("#tipe_pembayaran").val().split(",")[1];
  var tanggal_masuk     = $("#tgl_masuk").val();
  var tanggal_akhir     = $("#tgl_akhir").val();
  var tanggal_penagihan = $("#tgl_penagihan").val();
  var jatuh_tempo    = $("#jatuh_tempo").val();
  var harga_sewa     = Number($("#harga_sewa").val().split('.').join(""));
  var total_dibayar  = Number($("#dibayar").val().split('.').join(""));
  var tanggal_pembayaran= $("#tgl_pembayaran").val();
  var denda          = Number($("#denda").val().split('.').join(""));

  var total_pembayaran = Number($("#harga_sewa").val().split('.').join(""));
  var tagihan        = total_pembayaran-total_dibayar;

  var status_pembayaran = checkStatusPembayaran(tagihan, total_pembayaran);

  var hari_denda     = $("#hari_denda").val();

  checkNama(id);
  checkKamar(kamar);
  checkDurasi(durasi);
  checkHarga(harga_sewa);
  checkTglPenagihan();
  checkDenda(hari_denda);
  checkBalance(total_pembayaran, total_dibayar);

  if ($(".is-invalid").is(":visible")) {
    // swalert('warning','Terjadi Kesalahan', 'Mohon lengkapi isi form dengan benar.');
  } else {
    var jsonData  =  JSON.stringify({
      id_renter, id_member, kamar, durasi, tipe_pembayaran, tanggal_masuk, tanggal_akhir, tanggal_penagihan,
      denda, jatuh_tempo, harga_sewa, total_pembayaran, total_dibayar, tanggal_pembayaran, tagihan, status_pembayaran
    });
    console.log(jsonData);
    var token = Cookies.get("cookie_token");

    $.ajax({
      url   : domain+"/pembayaran",
      type  : 'POST',
      data  : jsonData,
      contentType: 'application/json',
      headers: {"Authorization": "Bearer "+token},
      success: function(response){
        if (response.status == true) {
          swalert('success','Sukses!', 'Pembayaran berhasil ditambahkan');
          // setTimeout(function () {
    			// 	// location.reload();
          //   window.location.href = "/pembayaran?invoice="+response.id_pembayaran;
    			// }, 2500);
        } else {
          swalert('warning','Terjadi Kesalahan!', 'Gagal tambah pembayaran.');
        }
      },
      error:function(error){
        swalertError();
      }
    })

  }
}

function checkNama(nama){
  if (nama != "") {
    $("#nama_anak_kos").removeClass("is-invalid");
    $("#invalid_nama_anak_kos").hide();
  } else {
    $("#nama_anak_kos").addClass("is-invalid");
    $("#invalid_nama_anak_kos").show().text("Silahkan isi bagian ini.");
  }
}

function checkKamar(kamar){
  if (kamar != "") {
    $("#kamar").removeClass("is-invalid");
    $("#invalid_kamar").hide();
  } else {
    $("#kamar").addClass("is-invalid");
    $("#invalid_kamar").show().text("Silahkan isi bagian ini.");
  }
}

function checkDurasi(durasi1){
  if (durasi1 != "") {
    $("#durasi1").removeClass("is-invalid");
    $("#invalid_durasi1").hide();
  } else {
    $("#durasi1").addClass("is-invalid");
    $("#invalid_durasi1").show().text("Silahkan isi bagian ini.");
  }
}

function checkHarga(harga){
  if (harga != "") {
    $("#harga_sewa").removeClass("is-invalid");
    $("#invalid_harga_sewa").hide();
  } else {
    $("#harga_sewa").addClass("is-invalid");
    $("#invalid_harga_sewa").show().text("Silahkan isi bagian ini.");
  }
}

function checkBatasAkhir(tgl_masuk, durasi, nhari, harga) {
  var total_hari     = durasi * nhari, harga;
  var date_masuk     = new Date(tgl_masuk)
  var tgl_akhir      = new Date(date_masuk);
  tgl_akhir.setDate(tgl_akhir.getDate() + total_hari);

  var dd = tgl_akhir.getDate();
  var mm = tgl_akhir.getMonth() + 1;
  var y = tgl_akhir.getFullYear();

  var format = y + '-' + mm + '-' + dd;

  $("#tgl_akhir").val(format);
  $("#nhari").text("(+"+total_hari+" hari)");
  var tot = formatRupiah(durasi*harga);
  $("#harga_sewa").val(tot);
  $("#label_harga_sewa").text("("+durasi+" x Rp "+formatRupiah(harga)+")");
}

function JatuhTempo(tgl_masuk, hari_denda, waktu_denda) {
  var durasi         = hari_denda * waktu_denda;
  var date_masuk     = new Date(tgl_masuk)
  var jatuh_tempo      = new Date(date_masuk);
  jatuh_tempo.setDate(jatuh_tempo.getDate() + durasi);

  var dd = jatuh_tempo.getDate();
  var mm = jatuh_tempo.getMonth() + 1;
  var y = jatuh_tempo.getFullYear();

  var format = y + '-' + mm + '-' + dd;

  if (hari_denda == 0 || hari_denda == "") {
    $("#jatuh_tempo").val('');
    $("#nharidenda").text("x");
  } else {
    $("#jatuh_tempo").val(format);
    $("#nharidenda").text(durasi);
  }
}

function checkTglPenagihan(){
  var tgl_penagihan = $("#tgl_penagihan").val();

  if($("#cb_penagihan").is(":checked")){
    if (tgl_penagihan < 1 || tgl_penagihan > 31) {
      $("#tgl_penagihan").addClass("is-invalid");
      $("#invalid_tgl_penagihan").show().text("minimal tanggal 1, maksimal tanggal 31");
    } else {
      $("#tgl_penagihan").removeClass("is-invalid");
      $("#invalid_tgl_penagihan").hide();
    }
  }
}

function checkDenda(hari_denda){
  if (hari_denda < 1 || hari_denda == "") {
    $("#hari_denda").addClass("is-invalid");
    $("#invalid_hari_denda").show().text("Silahkan isi bagian ini dan tidak 0");
  } else {
    $("#hari_denda").removeClass("is-invalid");
    $("#invalid_hari_denda").hide();
  }
}

function checkBalance(total_pembayaran, total_dibayar) {
  if (total_dibayar > total_pembayaran) {
    $("#dibayar").addClass("is-invalid");
    $("#invalid_dibayar").show().text("Nominal ini harus kurang dari atau sama dengan total tagihan pembayaran (Rp "+total_pembayaran+")");
  } else {
    $("#dibayar").removeClass("is-invalid");
    $("#invalid_dibayar").hide();
  }
}

function checkStatusPembayaran(tagihan, total_pembayaran) {
  var status_pembayaran;
  if (tagihan == 0) {
    status_pembayaran = "Lunas";
  } else if (tagihan == total_pembayaran) {
    status_pembayaran = "Belum Bayar";
  } else {
    status_pembayaran = "Angsur";
  }
  return status_pembayaran
}

function formatRupiah(bilangan){
  var	reverse = bilangan.toString().split('').reverse().join(''),
	ribuan 	= reverse.match(/\d{1,3}/g);
	ribuan	= ribuan.join('.').split('').reverse().join('');
  return ribuan;
}
