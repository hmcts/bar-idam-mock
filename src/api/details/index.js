import { Router } from 'express';
import fs from 'fs';
import path from 'path'

export default ({ config, db }) => {

  let api = Router();

  api.get('/details', (req, res) => {
    let token = req.header('Authorization');
    if (token && token.startsWith('Bearer ')){
      token = token.substring(7, token.length);
    }
    console.log('token:' + token);
    const user = db.find(token);
    if (!user) {
      res.status(403).send('Unauthorized');
    }
    res.json(user);
  });

  api.get('/fees', (req,res) => {
    fs.readFile('./resources/fees.json', function (err, data) {
      if (err) throw err;
      let fees = JSON.parse(data);
      const description = req.query.description || '';
      const feeVersionAmount = req.query.feeVersionAmount || '';
      if (!description && !feeVersionAmount) {
        res.json(fees);
      } else  if (description){
        res.json(fees.filter(fee => {
          if (fee.current_version && fee.current_version.description){
            return fee.current_version.description.includes(description);
          }
          return false;
        }));
      } else if (feeVersionAmount) {
        res.json(fees.filter(fee => {
          if (fee.current_version && fee.current_version.flat_amount){
            return fee.current_version.flat_amount.amount == feeVersionAmount;
          }
          return false;
        }));
      }
    });
  });

  api.get('/login', (req, res) => {
    const appDirArr = __dirname.split('/')
    const appDir = appDirArr.reduce((acc, current, index) => {
      if (current && index < appDirArr.length - 3){
        acc += '/' + current;
      }
      return acc;
    }, '');
    console.log(appDir);
    res.sendFile(path.join(appDir, '/resources/login.html'));
  })

  api.get('/login/logout', (req, res) => {
    res.redirect("https://localhost:3000/login");
  })

  api.post('/oauth2/token', (req, res) => {
    console.log(req.body);
    res.json({access_token: req.body.code});
  });

  api.post('/lease', (req, res) => {
    res.send('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbWMiLCJleHAiOjE1MzMyMzc3NjN9.3iwg2cCa1_G9-TAMupqsQsIVBMWg9ORGir5xZyPhDabk09Ldk0-oQgDQq735TjDQzPI8AxL1PgjtOPDKeKyxfg[akiss@reformMgmtDevBastion02');
  });

  api.post('/payment-records', (req, res) => {
    res.status(201).send({
      "reference": "RC-1534-8634-8352-6509",
      "date_created": "2018-08-21T14:58:03.630+0000",
      "status": "Initiated",
      "payment_group_reference": "2018-15348634835"
    });
  });

  return api;
};
