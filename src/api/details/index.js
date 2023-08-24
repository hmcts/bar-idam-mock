import { Router } from 'express';
import fs, { stat } from 'fs';
import path from 'path'

export default ({ config, db }) => {

  let api = Router();

  api.get('/details', (req, res) => {
    let token = req.header('Authorization');
    if (token && token.startsWith('Bearer ')){
      token = decodeURIComponent(token.substring(7, token.length));
    }
    console.log('token:' + token);
    if (token === 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbWMiLCJleHAiOjE1MzMyMzc3NjN9.3iwg2cCa1_G9-TAMupqsQsIVBMWg9ORGir5xZyPhDabk09Ldk0-oQgDQq735TjDQzPI8AxL1PgjtOPDKeKyxfg[akiss@reformMgmtDevBastion02') {
      res.status(200).send('ccpay_bubble');
      return;
    }
    const user = db.find(token);
    console.log('user: ' + user);
    if (!user) {
      res.status(403).send('Unauthorized');
    }
    res.json(user);
  });

  api.post('/oauth2/authorize', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send('{"code": "f3c68c69-4cc2-4dae-b0df-b95a4b69c6eb", "defaultUrl": "", "accessToken": ""}');
  });

  api.post('/user/registration', (req, res) => {
    res.status(409).send('{ "status": 409, "errorMessages": [ "The user is already registered." ]}');
  });

  api.delete('/session/:token', (req, res) => {
    res.status(204).send();
  })

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

  api.get('/logout', (req, res) => {
    res.redirect("http://localhost:3000/login");
  })

  api.post('/oauth2/token', (req, res) => {
    console.log(req.query);
    res.json({access_token: req.query.code});
  });

  api.post('/lease', (req, res) => {
    res.send('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbWMiLCJleHAiOjE1MzMyMzc3NjN9.3iwg2cCa1_G9-TAMupqsQsIVBMWg9ORGir5xZyPhDabk09Ldk0-oQgDQq735TjDQzPI8AxL1PgjtOPDKeKyxfg[akiss@reformMgmtDevBastion02');
  });

  api.get('/o/jwks', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send('{"keys": [{"kty": "RSA","kid": "123459876", "n": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAveB8g85P/5krFVOv/0qvEtGq+JGFl1rU0s30vIun3wBb601XgeIpHBhpXs7O0d+CbqsbIWBXfKk0b5Pp0BYQDr3NX1A0OSgFjFOvndLzalf7pfPAuM67RP2gQGX2raBZsM9HQJtu/6sAaO4y3TXpsPLsZ8vzncH1bFTBQE5TFDcXrrKGDR0Y0zEVifYgKW3o3iC+pCcUmwa6BR8WeOJd1HNPkocEw8GUnJdLsKTHCzHDT5EppfsKlaHD/poqFznwMKpTZtBRSF4FUCc+fUnTQoiVFGhmrQEVW9Sb9Zy4Am/TgUmobFCO90CIp9sggMLyJCnMt9h5A5xivCUPNiZWIwIDAQAB","e": "AQAB","alg" : "RS256"}]}');
  });

  api.post('/o/token', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send('{"access_token":"MockOauth2TokenForLocaldevelopmentnTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3","token_type":"bearer", "expires_in":35999, "scope":"openid profile roles"}');
  });

    api.get('/o/userinfo', (req, res) => {
        res.setHeader('content-type', 'application/json');
        res.status(200).send('{"email": "krishnakn00@gmail.com","roles": ["payments","caseworker"],"sub": "krishnakn00@gmail.com","uid": "11536d15-93ee-4149-a2b0-d60ff7ef42f7"}');
    });

  api.post('/o/authorize', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send('{"code": "f3c68c69-4cc2-4dae-b0df-b95a4b69c6eb", "defaultUrl": "", "accessToken": ""}');
  });

  api.get('/o/.well-known/openid-configuration', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send('{"issuer": "http://localhost:23443/o", "jwks_uri": "http://localhost:23443/o/jwks","authorization_endpoint": "http://localhost:23443/o/authorize", "token_endpoint": "http://localhost:23443/o/token","userinfo_endpoint": "http://localhost:23443/o/userinfo", "subject_types_supported": ["public"],"id_token_signing_alg_values_supported": ["ES384"], "request_object_signing_alg_values_supported":["ES384"],"request_object_encryption_alg_values_supported": ["RSA-OAEP"], "rcs_response_signing_alg_values_supported":["PS384"]}');
   });

  api.post('/payment-records', (req, res) => {
    console.log(req.body);
    if (req.body.payment_method === 'ALLPAY'){
      res.status(400).send({
        "timestamp": "2018-09-04T15:37:18.914+0000",
        "status": 400,
        "error": "Bad Request",
        "message": "JSON parse error: Cannot deserialize value of type `uk.gov.hmcts.payment.api.util.PaymentMethodType` from String \"ALLPAY\": value not one of declared Enum instance names: [CARD, CHEQUE, CASH, POSTAL_ORDER, BARCLAY_CARD, PBA]; nested exception is com.fasterxml.jackson.databind.exc.InvalidFormatException: Cannot deserialize value of type `uk.gov.hmcts.payment.api.util.PaymentMethodType` from String \"ALLPAY\": value not one of declared Enum instance names: [CARD, CHEQUE, CASH, POSTAL_ORDER, BARCLAY_CARD, PBA]\n at [Source: (PushbackInputStream); line: 3, column: 21] (through reference chain: uk.gov.hmcts.payment.api.dto.PaymentRecordRequest[\"payment_method\"])",
        "path": "/payment-records"
      });
    } else {
      res.status(200).send({
        "reference": "RC-1534-8634-8352-6509",
        "date_created": "2018-08-21T14:58:03.630+0000",
        "status": "Initiated",
        "payment_group_reference": "2018-15348634835"
      });
    }
  });

  api.post('/remission', (req, res) => {
    console.log(req.body);
    res.status(201).send({
      "remission_reference": "RM-1559-2207-2143-1903",
      "payment_group_reference": "2019-15592207213",
      "fee": {
        "id": 67383,
        "code": "FEE00007",
        "version": "3",
        "volume": 1,
        "calculated_amount": 550
      }
    });
  });
  
  api.get('/jurisdictions1', (req,res) => {
    fs.readFile('./resources/jurisdiction1.json', function (err, data) {
      if (err) throw err;
      let fees = JSON.parse(data);
      res.json(fees);
    });
  });

  api.get('/jurisdictions2', (req,res) => {
    fs.readFile('./resources/jurisdiction2.json', function (err, data) {
      if (err) throw err;
      let fees = JSON.parse(data);
      res.json(fees);
    });
  });

  api.get('/health**', (req, res) => {
    res.status(200).send({ status: 'UP'})
  });

  api.get('/cases/:caseref', (req, res) => {
    let status = 200;
    if(req.params.caseref.includes('1234')) {
      status = 404;
    }
    res.status(status).send();
  });

  api.post('/searchCases**', (req, res) => {
    fs.readFile('./resources/ccd_search_result.json', function (err, data) {
      if (err) throw err;
      let resp = JSON.parse(data);
      res.json(resp);
    });
  });

  return api;
};
