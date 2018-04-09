import { Router } from 'express';

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
    
    return api;
};