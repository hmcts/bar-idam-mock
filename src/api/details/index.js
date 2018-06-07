import { Router } from 'express';
import fs from 'fs';

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
            if (!description) {
                res.json(fees);
            } else {
                res.json(fees.filter(fee => {
                    if (fee.current_version && fee.current_version.description){
                        return fee.current_version.description.includes(description);
                    }
                    return false;
                }));
            }
        });
    });
    
    return api;
};