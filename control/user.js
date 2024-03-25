const db = require("../db");
const {TampilAdminId} =require("../control/page")

const RiwayatUser = (req,res) => {
    const username = req.params.username
    const isikueri = `SELECT * FROM siswa WHERE username = '${username}'`

    db.query( isikueri, (err, results) => {
        if(err){
            throw err;
        } else {
            res.set('Access-Control-Allow-Origin', '*')

            const queryHistoryUser = `SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, buku.pengarang, buku.penerbit, buku.tahun_terbit, siswa.no_induk, siswa.nama, jumlah_pinjam, pengembalian.jumlah_kembali, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
            LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
            LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
            LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi
            WHERE siswa.nama = "${results[0].nama}"`
        
            db.query(queryHistoryUser,(err, results) => {
                if(err){
                    throw err;
                } else {
                    res.set('Access-Control-Allow-Origin', '*')
                    res.send(results)
                }
            })
        }
    });

}

module.exports = {RiwayatUser}