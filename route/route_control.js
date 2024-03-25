const express = require("express");
const db = require('../db')
const router = express.Router();
const { Tampilbuku, Tambahbuku, Editbuku, Hapusbuku,
    Tampilsiswa, EditSiswa,Hapussiswa,TampilSiswaUser,
    Tampilpinjam, Tambahpinjam, Editpinjam, Hapuspinjam,
    Tampilkembali, Tambahkembali, Editkembali, Hapuskembali,
    Tampiladmin, Tambahadmin, Editadmin, Hapusadmin,
    searchBook,searchSiswa, TampilbukuId, tampilIdPinjam, searchPinjam, searchKembali, 
    TampilKembaliId, TampilpinjamId, TampilSiswaId, TampilStokKembali, tampilIdKembali, 
    tampilFilterTanggalPinjam, TampilAdminId, searchPinjamUser

    } = require("../control/page");
const {Notification,CountNotif, UpdateStatus, DetileNotif} = require ("../control/notif")
const {RiwayatUser} = require ("../control/user")
const {AdminLogin, RegistAmin, UserLogin, RegisUser, Logout, verifyToken} = require ('../login')

// const logoutTokens = [];

// Fungsi middleware untuk verifikasi token
// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];

//     // Periksa apakah token sudah logout
//     if (logoutTokens.includes(bearerToken)) {
//       return res.sendStatus(401); // Unauthorized
//     }

//     jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//         res.sendStatus(403); // Forbidden
//       } else {
//         req.user = decoded;
//         next();
//       }
//     });
//   } else {
//     res.sendStatus(403);
//   }
// }

// Endpoint untuk logout
// router.post('/logout', (req, res) => {
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];

//     // Tambahkan token ke daftar logout
//     logoutTokens.push(bearerToken);

//     res.json({ message: 'Logout berhasil' });
//   } else {
//     res.sendStatus(403);
//   }
// });

router.get("/tampil/book",verifyToken, Tampilbuku);
router.get("/tampil/book/:id",TampilbukuId);
router.post("/tambah/book",verifyToken, Tambahbuku);
router.put("/edit/book/:id",verifyToken, Editbuku);
router.delete("/hapus/book/:id",verifyToken, Hapusbuku);


router.get('/tampil/siswa',verifyToken,Tampilsiswa)
router.get('/tampil/siswa/:id',TampilSiswaId)
router.get('/tampil/user/:id',TampilSiswaUser) //uncheck
// router.post('/tambah/siswa',verifyToken,Tambahsiswa)
router.put('/edit/siswa/:id',verifyToken,EditSiswa)
router.delete('/hapus/siswa/:id',verifyToken,Hapussiswa)

router.get('/tampil/trx',verifyToken,Tampilpinjam)
router.post('/tampil/trxbytgl',verifyToken,tampilFilterTanggalPinjam)
router.get('/tampil/trx/:id',TampilpinjamId)
router.get('/tampil/idtrx',tampilIdPinjam)
router.post('/tambah/trx',verifyToken,Tambahpinjam)
router.put('/edit/trx/:id',verifyToken,Editpinjam)
router.delete('/hapus/trx/:id',verifyToken,Hapuspinjam)

router.get('/tampil/kembali',verifyToken,Tampilkembali)
router.get('/tampil/kembali/:id',TampilKembaliId)
router.get('/tampil/stok/:id',verifyToken,TampilStokKembali)
router.get('/tampil/idkembali',tampilIdKembali)
router.post('/tambah/kembali',verifyToken,Tambahkembali)
router.put('/edit/kembali/:id',verifyToken,Editkembali)
router.delete('/hapus/kembali/:id',verifyToken,Hapuskembali)

router.get('/tampil/admin',verifyToken,Tampiladmin)
router.get('/tampil/admin/:id',verifyToken,TampilAdminId)
router.post('/tambah/admin',verifyToken,Tambahadmin)
router.put('/edit/admin/:id',verifyToken,Editadmin)
router.delete('/hapus/admin/:id',verifyToken,Hapusadmin)

router.post('/searchBook', searchBook)
router.post('/searchSiswa', searchSiswa)
router.post('/searchPinjam', searchPinjam)
router.post('/searchPinjamUser/:noinduk', searchPinjamUser)
router.post('/searchKembali', searchKembali)

router.get('/notif',verifyToken,Notification)
router.put('/readStatus/:kode',verifyToken,UpdateStatus)
router.get('/count-notif',verifyToken,CountNotif)
router.get('/detile/:kode',verifyToken,DetileNotif)
router.get('/riwayat-user/:username',RiwayatUser)

router.post('/login',AdminLogin)
router.post('/register',RegistAmin)
router.post('/login-user',UserLogin)
router.post('/register-user',RegisUser)
router.post('/logout',Logout)

module.exports = router;
