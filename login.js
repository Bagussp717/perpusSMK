const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');
const {
  generateSalt, hashPassword
} = require('./route/generator')

require("dotenv").config();

const loginTokens = {};


const AdminLogin = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM admin WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        return;
      }

      if (Array.isArray(results) && results.length > 0) {
        const user = results[0];
        const role = 'admin'
        const hashedPassword = hashPassword(password, user.salt, user.pepper);
        if (hashedPassword === user.password) {
          jwt.sign({ username,role }, 'secretkey', { expiresIn: '1d' }, (err, token) => {
            if (!loginTokens[username]) {
              loginTokens[username] = [];
            }
            loginTokens[username].push(token);            
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ 
              message: 'Login successful',
              redirectUrl: '/admin/home',
              role: role,
              success: true,
              token: token
            });
          });
        } else {
          res.status(401).json({ success: false, message: 'Username atau password salah!' });
          console.log(err)
        }
      }
    }
  );
};


const RegistAmin = (req, res) => {
  const { username, password } = req.body;
  const salt = generateSalt();
  const pepper = 'sparta';
  
  const hashedPassword = hashPassword(password, salt, pepper);

  db.query(
    "SELECT username FROM admin WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        return;
      } else {
        if (results.length > 0) {
          res.status(400).send("Username Sudah ada");
          return;
        } else {
          db.query(
            "INSERT INTO admin (username, password, salt, pepper) VALUES (?, ?, ?, ?)",
            [username, hashedPassword, salt, pepper],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
                return;
              }
              res.json({ success: true, message: 'Registrasi berhasil' });
            }
          );
        }
      }
    }
  );
}
const UserLogin =  (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM siswa WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        return;
      }

      if (Array.isArray(results) && results.length > 0) {
        const user = results[0];
        const role = 'user'
        const hashedPassword = hashPassword(password, user.salt, user.pepper);
        if (hashedPassword === user.password) {
          jwt.sign({ username,role }, 'secretkey', { expiresIn: '1d' }, (err, token) => {
            if (!loginTokens[username]) {
              loginTokens[username] = [];
            }
            loginTokens[username].push(token);
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({
              redirectUrl: `/${user.no_induk}/buku/daftarbuku`,
              role: role,
              success: true,
              token: token,
              message: 'Login successful'
            });
          });
        } else {
          res.status(401).json({ success: false, message: 'Username atau password salah!' });
        }
      }
    }
  );
}

const RegisUser = (req, res) => {
  const { username, no_induk, nama, prodi, password } = req.body;
  const salt = generateSalt();
  const pepper = 'sparta';
  
  const hashedPassword = hashPassword(password, salt, pepper);

  db.query(
    "SELECT username FROM siswa WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        return;
      } else {
        if (results.length > 0) {
          res.status(400).send("Username Sudah ada");
          return;
        } else {
          db.query(
            "INSERT INTO siswa (username, no_induk, nama, prodi, password, salt, pepper) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [username, no_induk, nama, prodi, hashedPassword, salt, pepper],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
                return;
              }
              res.json({ success: true, message: 'Registrasi berhasil' });
            }
          );
        }
      }
    }
  );
}

const Logout = (req, res) => {
  const { username, token } = req.body;
  // Hapus token yang sesuai dari array loginTokens
  if (loginTokens[username]) {
    const index = loginTokens[username].indexOf(token);
    if (index !== -1) {
      loginTokens[username].splice(index, 1);
    }
  }
  res.status(200).json({ message: 'Logout successful' });
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    // Loop melalui loginTokens untuk memeriksa token
    for (const key in loginTokens) {
      if (loginTokens[key].includes(bearerToken)) {
        jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
          if (err) {
            res.sendStatus(403); // Forbidden
          } else {
            req.user = decoded;
            next();
          }
        });
        return; // Token valid, lanjutkan ke middleware selanjutnya
      }
    }
  }
  res.sendStatus(401); // Unauthorized
}


module.exports = {AdminLogin,RegistAmin,UserLogin,verifyToken,RegisUser,Logout};
