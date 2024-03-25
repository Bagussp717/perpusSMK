const db = require("../db");
const {
  generateSalt, hashPassword
} = require('../route/generator');
const { TambahNotif } = require("./notif");
//contral Buku
const Tampilbuku = (req, res) => {

  db.query("SELECT * FROM buku", (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log("Data kueri buku : \n", results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send(results);
    }
  });

};

const TampilbukuId = (req, res) => {
  const id_buku = req.params.id
  const isikueri = `SELECT * FROM buku WHERE kode_buku = '${id_buku}'`
  db.query( isikueri, (err, results) => {
      if(err){
          throw err;
      } else {
          console.log('Pilih judul buku by id : \n',results)
          res.set('Access-Control-Allow-Origin', '*')
          res.send(results)
      }
  });
}

const Tambahbuku = (req, res) => {
  const {
    kode_buku,
    judul_buku,
    kategori,
    isbn,
    stok,
    pengarang,
    penerbit,
    tahun_terbit,
  } = req.body;

  console.log(kategori)

  const query =
    "INSERT INTO buku (kode_buku, judul_buku, kategori, isbn, stok, pengarang, penerbit, tahun_terbit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    if (req.user.role == 'admin'){
    db.query(
      query,
      [
        kode_buku,
        judul_buku,
        kategori,
        isbn,
        stok,
        pengarang,
        penerbit,
        tahun_terbit,
      ],
      (err, result) => {
        if (err) {
          console.error("Error Input data ke MySQL: " + err.stack);
          res.status(500).send("Internal Server Error");
          return;
        }

        console.log(
          "Data Sukses di Inputkan ke MySQL dengan ID: " + result.insertId
        );
        res.status(200).send("Upload success");
      }
    );}
};

const Editbuku = (req, res) => {
  const id = req.params.id;
  const {
    judul_buku,
    kategori,
    isbn,
    stok,
    pengarang,
    penerbit,
    tahun_terbit,
  } = req.body;

  const kueriCek = `SELECT * FROM buku WHERE kode_buku = '${id}'`;
  if (req.user.role == 'admin'){
  db.query(kueriCek, (err, results) => {
    if (err) {
      throw err;
    } else {
      const currentData = results[0];
      if (
        currentData.judul_buku === judul_buku &&
        currentData.kategori === kategori &&
        currentData.isbn === isbn &&
        currentData.stok === stok &&
        currentData.pengarang === pengarang &&
        currentData.penerbit === penerbit &&
        currentData.tahun_terbit === tahun_terbit
      ) {
        // Data is the same, no need to update
        res.set("Access-Control-Allow-Origin", "*");
        res.send("No changes detected. Data remains the same.");
      } else {
        // Data has changed, proceed with the update query
        const kueriUpdate = `UPDATE buku SET judul_buku = ?, kategori = ?, isbn = ?, stok = ?, pengarang = ?, penerbit = ?, tahun_terbit = ? WHERE kode_buku = ?`;
        const values = [
          judul_buku,
          kategori,
          isbn,
          stok,
          pengarang,
          penerbit,
          tahun_terbit,
          id,
        ];

        db.query(kueriUpdate, values, (updateErr, updateResults) => {
          if (updateErr) {
            throw updateErr;
          } else {
            console.log(
              "Data kueri Buku berhasil diupdate! \n",
              updateResults.affectedRows,
              " data kueri"
            );
            res.set("Access-Control-Allow-Origin", "*");
            res.send("Data kueri Buku berhasil diupdate! ");
          }
        });
      }
    }
  });
}
};


const Hapusbuku = (req, res) => {
  const id = req.params.id;
  const isikueri = `DELETE FROM buku WHERE buku.kode_buku = '${id}'`;
  if (req.user.role == 'admin'){
  db.query(isikueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Buku berhasil di hapus!");
    }
  });
}
};

//control Siswa
const Tampilsiswa = (req, res) => {
  db.query("SELECT * FROM siswa ORDER BY prodi", (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log("Data kueri Siswa : \n", results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send(results);
    }
  });
};
const TampilSiswaId = (req, res) => {
  const noInduk = req.params.id
  const isikueri = `SELECT * FROM siswa WHERE no_induk = '${noInduk}'`
  db.query( isikueri, (err, results) => {
      if(err){
          throw err;
      } else {
          console.log('Pilih judul buku by id : \n',results)
          res.set('Access-Control-Allow-Origin', '*')
          res.send(results)
      }
  });
}
const TampilSiswaUser = (req, res) => {
  const noInduk = req.params.id
  const isikueri = `SELECT * FROM siswa WHERE username = '${noInduk}'`
  db.query( isikueri, (err, results) => {
      if(err){
          throw err;
      } else {
          console.log('Pilih judul buku by id : \n',results)
          res.set('Access-Control-Allow-Origin', '*')
          res.send(results)
      }
  });
}

// const Tambahsiswa = (req, res) => {
//   const {
//     no_induk,
//     nama,
//     prodi,
//     username,
//     password
//   } = req.body;

//   const salt = generateSalt();
//   const pepper = 'sparta';  
//   const hashedPassword = hashPassword(password, salt, pepper);

//   const query =
//     "INSERT INTO siswa ( no_induk, nama, prodi, username, password) VALUES (?, ?, ?, ?, ?)";

//   db.query(
//     query,
//     [
//       no_induk,
//       nama,
//       prodi,
//       username,
//       hashedPassword
//     ],
//     (err, result) => {
//       console.log(query)
//       if (err) {
//         console.error("Error Input data ke MySQL: " + err.stack);
//         res.status(500).send("Internal Server Error");
//         return;
//       }

//       console.log(
//         "Data Sukses di Inputkan ke MySQL dengan ID: " + result.insertId
//       );
//       res.status(200).send("Upload success");
//     }
//   );
// };

const EditSiswa = (req, res) => {
  const id = req.params.id;
  const {
    no_induk,
    nama,
    prodi,
    username,
    password
  } = req.body;

  const salt = generateSalt();
  const pepper = 'sparta';  
  const hashedPassword = hashPassword(password, salt, pepper);
  const kueri = `UPDATE siswa SET no_induk = '${no_induk}', nama = '${nama}',  prodi = '${prodi}', username = '${username}', password = '${hashedPassword}',salt = '${salt}', pepper = '${pepper}' WHERE no_induk = '${id}' `;

  db.query(kueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(
        "Data kueri Siswa berhasil diupdate! \n",
        results.affectedRows, 
        " data kueri"
      );
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Data kueri Siswa berhasil diupdate! ");
    }
  });
};

const Hapussiswa = (req, res) => {
  const id = req.params.id;
  const isikueri = `DELETE FROM siswa WHERE siswa.no_induk = '${id}'`;
  db.query(isikueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Siswa berhasil di hapus!");
    }
  });
};

//CONTROLL PEMINJAM

const Tampilpinjam = (req, res) => {
  db.query("SELECT * FROM peminjam_buku", (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log("Data kueri Peminjam : \n", results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send(results);
    }
  });
};

const TampilpinjamId = (req, res) => {
  const kode = req.params.id
  console.log(kode)
  const isikueri = `SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, siswa.no_induk, siswa.nama, siswa.prodi, jumlah_pinjam, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
  LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
  LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
  LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi WHERE kode_transaksi = '${kode}'`

  db.query( isikueri, (err, results) => {
      if(err){
          throw err;
      } else {
          console.log('Pilih judul buku by id : \n',results)
          res.set('Access-Control-Allow-Origin', '*')
          res.send(results)
      }
  });
}

const tampilFilterTanggalPinjam = (req, res) => {
  const { startDate, endDate } = req.body;  

  const kuery = `SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, buku.pengarang, buku.penerbit, buku.tahun_terbit, siswa.no_induk, siswa.nama, jumlah_pinjam, pengembalian.jumlah_kembali, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
  LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
  LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
  LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi WHERE tanggal_pinjam >= '${startDate}' AND tanggal_pinjam <= '${endDate}'`;

  db.query(kuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).send(result);
  });
};



const tampilIdPinjam = (req, res) => {

  db.query("SELECT kode_transaksi FROM peminjam_buku ORDER BY kode_transaksi DESC LIMIT 1;", (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.length === 0) {
        res.set("Access-Control-Allow-Origin", "*");
        res.send([{ kode_transaksi: "PI0000" }]);
      } else {
        console.log("Data kueri buku : \n", results);
        res.set("Access-Control-Allow-Origin", "*");
        res.send(results);
      }
    }
  });

};

const Tambahpinjam = (req, res) => {
  const {
      kode_transaksi,
      no_induk,
      kode_buku,
      jumlah_pinjam,
      tanggal_pinjam,
      tanggal_kembali

  } = req.body;

  const query_IdBuku = `SELECT id,judul_buku FROM buku WHERE kode_buku ='${kode_buku}'`
  let id_buku
  let judulBuku
  db.query(query_IdBuku,(err,results) =>{
    if (err) {
      console.error("Error saat memeriksa buku: " + err.stack);
        res.status(500).send("Internal Server Error");
    } else {
      if (results.length > 0) {
        id_buku = results[0].id;
        judulBuku = results[0].judul_buku;
      } else {
        console.error('Student not found with the given student ID:', no_induk);
      }
      return
    }
  })
  const query_IdSiswa = `SELECT id,nama FROM siswa WHERE no_induk ='${no_induk}'`
  let id_siswa
  let namaPeminjam
  db.query(query_IdSiswa,(err,results) =>{
    if (err) {
      console.error("Error saat memeriksa Data Peminjam: " + err.stack);
        res.status(500).send("Internal Server Error");
    } else {
      if (results.length > 0) {
        id_siswa = results[0].id;
        namaPeminjam = results[0].nama;
      } else {
        console.error('Student not found with the given student ID:', no_induk);
      }
      return
    }
  })

  const queryInsert =
    "INSERT INTO peminjam_buku ( kode_transaksi, id_siswa, id_buku, jumlah_pinjam, tanggal_pinjam, tanggal_kembali ) VALUES (?, ?, ?, ?, ?, ?)";

  const queryUpdateStok =
    "UPDATE buku SET stok = stok - ? WHERE kode_buku = ?";

  const queryCheckStok =
    "SELECT stok FROM buku WHERE kode_buku = ?";

  db.query(
    queryCheckStok,
    [kode_buku],
    (err, result) => {
      if (err) {
        console.error("Error saat memeriksa stok buku: " + err.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (result.length === 0) { // Tidak ada buku dengan kode_buku yang diberikan
        res.status(404).send([{message:"Buku tidak ditemukan"}]);
        return;
      }

      const stokBuku = result[0].stok;

      if (stokBuku < jumlah_pinjam) {
        res.status(400).send([{message:"Stok buku tidak mencukupi"}]);
        return;
      }

      db.beginTransaction((err) => {
        if (err) {
          console.error("Error saat memulai transaksi: " + err.stack);
          res.status(500).send("Internal Server Error");
          return;
        }

        db.query(
          queryInsert,
          [kode_transaksi,
            id_siswa,
            id_buku,
            jumlah_pinjam,
            tanggal_pinjam,
            tanggal_kembali],
          (err, result) => {
            if (err) {
              db.rollback(() => {
                console.error("Error Input data ke MySQL: " + err.stack);
                res.status(500).send([{message:"Data Tidak Peminjaman Sesuai"}]);
              });
              return;
            }

            const insertedId = result.insertId;
            console.log("Data Sukses di Inputkan ke MySQL dengan ID: " + insertedId);
            TambahNotif(kode_transaksi, namaPeminjam, judulBuku, jumlah_pinjam)

            db.query(
              queryUpdateStok,
              [jumlah_pinjam, kode_buku],
              (err, result) => {
                if (err) {
                  db.rollback(() => {
                    console.error("Error mengupdate stok buku: " + err.stack);
                    res.status(500).send("Internal Server Error");
                  });
                  return;
                }

                db.commit((err) => {
                  if (err) {
                    db.rollback(() => {
                      console.error("Error saat melakukan commit: " + err.stack);
                      res.status(500).send("Internal Server Error");
                    });
                    return;
                  }

                  console.log("Stok buku berhasil diupdate.");
                  res.status(200).send("Upload success");
                });
              }
            );
          }
        );
      });
    }
  );
};

const Editpinjam = (req, res) => {
  const id = req.params.id;
  const {
    no_induk, kode_buku, jumlah_pinjam, tanggal_pinjam, tanggal_kembali
  } = req.body;
  console.log(id)

  const kueri = `UPDATE peminjam_buku SET no_induk = '${no_induk}',  kode_buku = '${kode_buku}',jumlah_pinjam = '${jumlah_pinjam}',tanggal_pinjam = '${tanggal_pinjam}',tanggal_kembali = '${tanggal_kembali}'  WHERE kode_transaksi = '${id}' `;

  db.query(kueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(
        "Data kueri User berhasil diupdate! \n",
        results.affectedRows, 
        " data kueri"
      );
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Data kueri Peminjaman berhasil diupdate! ");
    }
  });
};

const Hapuspinjam = (req, res) => {
  const id = req.params.id;
  const isikueri = `DELETE FROM peminjam_buku WHERE kode_transaksi = '${id}'`;
  db.query(isikueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Peminjaman berhasil di hapus!");
    }
  });
};

// Contorll Kembali
const Tampilkembali = (req, res) => {
  db.query("SELECT peminjam_buku.kode_transaksi, pengembalian.jumlah_kembali, pengembalian.tanggal_kembali, id_pengembalian FROM pengembalian LEFT JOIN peminjam_buku ON pengembalian.id_transaksi = peminjam_buku.id", (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log("Data kueri Pengembalian : \n", results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send(results);
    }
  });
};

const tampilIdKembali = (req, res) => {

  db.query("SELECT id_pengembalian FROM pengembalian ORDER BY id_pengembalian DESC LIMIT 1;", (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.length === 0) {
        res.set("Access-Control-Allow-Origin", "*");
        res.send([{ id_pengembalian: "BC0000" }]);
      } else {
        console.log("Data kueri buku : \n", results);
        res.set("Access-Control-Allow-Origin", "*");
        res.send(results);
      }
    }
  });

};



const TampilKembaliId = (req, res) => {
  const id = req.params.id
  const isikueri = `SELECT peminjam_buku.kode_transaksi, pengembalian.jumlah_kembali, pengembalian.tanggal_kembali FROM pengembalian
  LEFT JOIN peminjam_buku ON pengembalian.id_transaksi = peminjam_buku.id WHERE id_pengembalian = '${id}'`
  db.query( isikueri, (err, results) => {
      if(err){
          throw err;
      } else {
          console.log('Pilih judul buku by id : \n',results)
          res.set('Access-Control-Allow-Origin', '*')
          res.send(results)
      }
  });
}

const TampilStokKembali = (req, res) => {
  const filter = req.params.id
  let query

  if (filter == 'all-history'){
    query = `
    SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, buku.pengarang, buku.penerbit, buku.tahun_terbit, siswa.no_induk, siswa.nama, siswa.prodi, jumlah_pinjam, pengembalian.jumlah_kembali, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
    LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
    LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
    LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi 
    WHERE MONTH(tanggal_pinjam) = MONTH(CURRENT_DATE()) 
    AND YEAR(tanggal_pinjam) = YEAR(CURRENT_DATE())
  `;
  } else if (filter =='red-history' ){
    query = `
    SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, buku.pengarang, buku.penerbit, buku.tahun_terbit, siswa.no_induk, siswa.nama, siswa.prodi, jumlah_pinjam, pengembalian.jumlah_kembali, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
    LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
    LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
    LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi
  `;
  }
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
}

const Tambahkembali = (req, res) => {
  const {
    id_pengembalian, kode_transaksi, tanggal_kembali, jumlah_kembali
  } = req.body;

  const queryInsert =
    "INSERT INTO pengembalian (id_pengembalian, id_transaksi	, tanggal_kembali, jumlah_kembali) VALUES (?, ?, ?, ?)";

  const queryCheckTrx =
    "SELECT buku.kode_buku FROM peminjam_buku LEFT JOIN buku ON peminjam_buku.id_buku = buku.id WHERE kode_transaksi = ?";

  const queryCheckIdTrx =
    "SELECT peminjam_buku.id FROM peminjam_buku WHERE kode_transaksi = ?";

  let id_transaksi

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    db.query(queryCheckIdTrx,
      [kode_transaksi],
      (err,result) => {
      console.log(queryCheckIdTrx)
      if(err){
        console.error("Error starting transaction: " + err.stack);
        res.status(500).send("Internal Server Error");
      }else{
        id_transaksi = result[0].id
        db.query(
          queryInsert,
          [id_pengembalian, id_transaksi, tanggal_kembali, jumlah_kembali],
          (err, result) => {
            if (err) {
              console.error("Error inserting data into MySQL: " + err.stack);
              db.rollback(() => {
                res.status(500).send("Internal Server Error");
              });
              return;
            }
    
            const insertId = result.insertId;
            console.log("Data Sukses di Inputkan ke MySQL dengan ID: " + insertId);
    
            db.query(
              queryCheckTrx,
              [kode_transaksi],
              (err, result) => {
                if (err) {
                  console.error("Error retrieving kode_buku: " + err.stack);
                  db.rollback(() => {
                    res.status(500).send("Internal Server Error");
                  });
                  return;
                }
    
                if (result.length === 0) {
                  console.error("No book found with the given kode_transaksi.");
                  db.rollback(() => {
                    res.status(404).send("Book not found");
                  });
                  return;
                }
    
                const kode_buku = result[0].kode_buku;
                const queryUpdateStok =
                  "UPDATE buku SET stok = stok + ? WHERE kode_buku = ?";
    
                db.query(
                  queryUpdateStok,
                  [jumlah_kembali, kode_buku],
                  (err, result) => {
                    if (err) {
                      console.error("Error updating stok: " + err.stack);
                      db.rollback(() => {
                        res.status(500).send("Internal Server Error");
                      });
                      return;
                    }
    
                    db.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction: " + err.stack);
                        db.rollback(() => {
                          res.status(500).send("Internal Server Error");
                        });
                        return;
                      }
    
                      console.log("Stok buku updated successfully.");
                      res.status(200).send("Upload success");
                    });
                  }
                );
              }
            );
          }
        );
      }
    })
  });
};


const Editkembali = (req, res) => {
  const id = req.params.id;
  const { tanggal_kembali, jumlah_kembali
  } = req.body;

  // Mengambil jumlah_kembali sebelum diupdate
  const getJumlahKembaliQuery = `SELECT jumlah_kembali FROM pengembalian WHERE id_pengembalian = '${id}'`;

  db.query(getJumlahKembaliQuery, (err, rows) => {
    if (err) {
      throw err;
    } else {
      const previousJumlahKembali = rows[0].jumlah_kembali;
      
      const kueri = `UPDATE pengembalian SET tanggal_kembali = '${tanggal_kembali}',jumlah_kembali ='${jumlah_kembali}'  WHERE id_pengembalian = '${id}' `;

      db.query(kueri, (err, results) => {
        if (err) {
          throw err;
        } else {
          console.log(
            "Data kueri User berhasil diupdate! \n",
            results.affectedRows,
            " data kueri"
          );

            const queryId_transaksi = `SELECT id_transaksi FROM pengembalian WHERE id_pengembalian = '${id}' `

            db.query(queryId_transaksi, (err, rows) => {
              if (err) {
                throw err;
              } else {
                const id_transaksi = rows[0].id_transaksi
                // Menentukan operasi yang akan dilakukan pada stok buku
              const getKodeBuku = `SELECT id_buku FROM peminjam_buku WHERE id = '${id_transaksi}'`
              db.query( getKodeBuku, (err, rows) => {
                if(err){
                    throw err;
                } else {
                  const kode = rows[0].id_buku
                  console.log(kode)

                  let updateStockQuery = "";
              if (jumlah_kembali < previousJumlahKembali) {
                const difference = previousJumlahKembali - jumlah_kembali;
                updateStockQuery = `UPDATE buku SET stok = stok - ${difference} WHERE id = ?`;
              } else if (jumlah_kembali > previousJumlahKembali) {
                const difference = jumlah_kembali - previousJumlahKembali;
                updateStockQuery = `UPDATE buku SET stok = stok + ${difference} WHERE id = ?`;
              }

          // Menjalankan query untuk mengupdate stok buku jika diperlukan
          if (updateStockQuery) {
            db.query(updateStockQuery, [kode], (err, stockResults) => {
              if (err) {
                throw err;
              } else {
                console.log("Stok buku berhasil diupdate!");
              }
            });
          }
            }
          })
              }
            })
        

          res.set("Access-Control-Allow-Origin", "*");
          res.send("Data kueri Pengembalian berhasil diupdate! ");
        }
      });
    }
  });
};


const Hapuskembali = (req, res) => {
  const id = req.params.id;
  const isikueri = `DELETE FROM pengembalian WHERE pengembalian.id_pengembalian = '${id}'`;
  db.query(isikueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Pengembalian berhasil di hapus!");
    }
  });
};


// admin

const Tampiladmin = (req, res) => {
  db.query("SELECT * FROM admin", (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log("Data kueri Pengembalian : \n", results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send(results);
    }
  });
};

const TampilAdminId = (req, res) => {
  const username = req.params.id
  const isikueri = `SELECT * FROM admin WHERE username = '${username}'`
  db.query( isikueri, (err, results) => {
      if(err){
          throw err;
      } else {
          console.log('Pilih judul buku by id : \n',results)
          res.set('Access-Control-Allow-Origin', '*')
          res.send(results)
      }
  });
}

const Tambahadmin = (req, res) => {
  const {
    id, username, password		

  } = req.body;

  const query =
    "INSERT INTO admin ( id, username, password ) VALUES ( ?, ?, ? )";

    console.log(query)

  db.query(
    query,
    [
      id, username, password	
    ],
    (err, result) => {
      if (err) {
        console.error("Error Input data ke MySQL: " + err.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      console.log(
        "Data Sukses di Inputkan ke MySQL dengan ID: " + result.insertId
      );
      res.status(200).send("Upload success");
    }
  );
};

const Editadmin = (req, res) => {
  const id = req.params.id;
  const {
    username, password	
  } = req.body;

  const salt = generateSalt();
  const pepper = 'sparta';  
  const hashedPassword = hashPassword(password, salt, pepper);

  const kueri = `UPDATE admin SET username = '${username}',password = '${hashedPassword}',salt = '${salt}', pepper = '${pepper}'  WHERE username = '${id}' `;

  db.query(kueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(
        "Data kueri User berhasil diupdate! \n",
        results.affectedRows, 
        " data kueri"
      );
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Data kueri Pengembalian berhasil diupdate! ");
    }
  });
};

const Hapusadmin = (req, res) => {
  const id = req.params.id;
  const isikueri = `DELETE FROM admin WHERE admin.id = '${id}'`;
  db.query(isikueri, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results);
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Pengembalian berhasil di hapus!");
    }
  });
};

//Pencarian Buku

const searchBook = (req, res) =>{
  const query = req.query.s
  const isiQuery = `
    SELECT * FROM buku 
    WHERE 
      kode_buku LIKE '%${query}%' OR
      judul_buku LIKE '%${query}%' OR
      kategori LIKE '%${query}%' OR
      isbn LIKE '%${query}%' OR
      stok LIKE '%${query}%' OR
      pengarang LIKE '%${query}%' OR
      penerbit LIKE '%${query}%' OR
      tahun_terbit LIKE '%${query}%'
  `;

  db.query(isiQuery, (err, results)=>{
      if(err) throw err
      res.send(results)
  })
}

const searchSiswa = (req, res) =>{
  const query = req.query.s
  console.log(query)
  const isiQuery = `SELECT * FROM siswa 
  WHERE nama LIKE '%${query}%' OR 
  no_induk LIKE '%${query}%' OR
  prodi LIKE '%${query}%'`

  db.query(isiQuery, (err, results)=>{
      if(err) throw err
      res.send(results)
  })
}

const searchKembali = (req, res) =>{
  const query = req.query.s
  console.log(query)
  const isiQuery = `SELECT * FROM pengembalian
  WHERE id_pengembalian LIKE '%${query}%'`

  db.query(isiQuery, (err, results)=>{
      if(err) throw err
      res.send(results)
  })
}

const searchPinjam = (req, res) =>{
  const query = req.query.s
  console.log(query)
  const isiQuery = `SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, buku.pengarang, buku.penerbit, buku.tahun_terbit, siswa.no_induk, siswa.nama, jumlah_pinjam, pengembalian.jumlah_kembali, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
  LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
  LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
  LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi 
  WHERE kode_transaksi LIKE '%${query}%'
  OR judul_buku LIKE '%${query}%'
  OR penerbit LIKE '%${query}%'
  OR pengarang LIKE '%${query}%'
  OR kode_buku LIKE '%${query}%'
  OR nama LIKE '%${query}%'
  OR tahun_terbit LIKE '%${query}%'
  OR no_induk LIKE '%${query}%'`

  db.query(isiQuery, (err, results)=>{
      if(err) throw err
      res.send(results)
  })
}
const searchPinjamUser = (req, res) =>{
  const query = req.query.s
  const noInduk = req.params.noinduk

  const queryId_siswa = `SELECT id FROM siswa WHERE no_induk = '${noInduk}'`
  let id_siswa
  db.query(queryId_siswa,(err,result) =>{
    if(err){
      throw err;
    }
    id_siswa = result[0].id
    const isiQuery = `SELECT kode_transaksi, buku.kode_buku, buku.judul_buku, buku.pengarang, buku.penerbit, buku.tahun_terbit, siswa.no_induk, siswa.nama, jumlah_pinjam, pengembalian.jumlah_kembali, tanggal_pinjam, peminjam_buku.tanggal_kembali FROM peminjam_buku 
    LEFT JOIN buku ON peminjam_buku.id_buku = buku.id 
    LEFT JOIN siswa ON peminjam_buku.id_siswa = siswa.id
    LEFT JOIN pengembalian ON peminjam_buku.id = pengembalian.id_transaksi 
    WHERE id_siswa = '${id_siswa}' AND (kode_transaksi LIKE '%${query}%' OR judul_buku LIKE '%${query}%')`

    db.query(isiQuery, (err, results)=>{
        if(err) throw err
        res.send(results)
    })
    })
}


module.exports = { Tampilbuku, Tambahbuku, Editbuku, Hapusbuku,TampilbukuId,
                  Tampilsiswa, EditSiswa,Hapussiswa,TampilSiswaId,
                  Tampilpinjam, Tambahpinjam, Editpinjam, Hapuspinjam,tampilIdPinjam,TampilpinjamId,tampilFilterTanggalPinjam,
                  Tampilkembali, Tambahkembali, Editkembali, Hapuskembali,tampilIdKembali,TampilKembaliId,TampilStokKembali,
                  Tampiladmin, TampilAdminId, Tambahadmin, Editadmin, Hapusadmin,
                  searchBook,searchSiswa,searchPinjam,searchPinjamUser,searchKembali,TampilSiswaUser
                  };
