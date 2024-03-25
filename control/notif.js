const db = require("../db");
const { BotTele } = require("./botTele");

const Notification = (req, res) => {
  if (req.user.role == 'admin'){
    db.query("SELECT * FROM `notifications` ORDER BY read_status ASC", (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log("Data kueri buku : \n", results);
        res.set("Access-Control-Allow-Origin", "*");
        res.send(results);
      }
    });
  }else {
    res.status(403).send('Akses ditolak');
}
}

const TambahNotif = (kode_transaksi, namaPeminjam, judulBuku, jumlahPinjam) => {
  const message = `Peminjam ${namaPeminjam} sedang megajukan peminjaman Buku ${judulBuku} sebanjak ${jumlahPinjam}`
  const pesanTele = `*Reservasi Baru* :
  Judul Buku  : *${judulBuku}*
  Nama Peminjam : *${namaPeminjam}*
  Jumlah Buku : *${jumlahPinjam}*`


  const query =
    "INSERT INTO notifications (message, kode_transaksi) VALUES (?,?)";

    if (req.user.role == 'admin'){
      db.query(
        query,
        [
          message,
          kode_transaksi
        ],
        (err, result) => {
          if (err) {
            console.error("Error Input data ke MySQL: " + err.stack);
            return;
          }
    
          console.log(
            "Data Sukses di Inputkan ke MySQL dengan ID: " + result.insertId
          )
          BotTele(pesanTele)
        }
      );
    }

};


const CountNotif = (req,res) => {
  const isikueri = `SELECT COUNT(read_status) AS Jumlah FROM notifications WHERE read_status = '0'`
  if (req.user.role == 'admin'){
  db.query(isikueri,(err, results) =>{
    if (err) {
      throw err;
    } else {
      console.log("Data kueri buku : \n", results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send(results);
    }
  })
}
}

const UpdateStatus = (req,res) =>{
  const kode_transaksi = req.params.kode

  const query = `UPDATE notifications SET read_status = 1 WHERE kode_transaksi = '${kode_transaksi}'`
  if (req.user.role == 'admin'){
  db.query(query, (err,result)=>{
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }else{
      res.status(200).send(result)
      console.log('Notifikasi Telah di buka')
    }
  })
}
}

const DetileNotif = (req,res) => {
  const kode_transaksi = req.params.kode
  const query = `SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, buku.pengarang, buku.penerbit, buku.tahun_terbit, siswa.no_induk, siswa.nama, siswa.prodi, jumlah_pinjam, pengembalian.jumlah_kembali, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
  LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
  LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
  LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi 
  WHERE kode_transaksi = '${kode_transaksi}'`
  if (req.user.role == 'admin'){
  db.query(query, (err,result)=>{
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }else{
      res.status(200).send(result)
    }
  })
}
}
module.exports = {Notification, CountNotif, TambahNotif, UpdateStatus, DetileNotif}