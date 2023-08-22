const { response } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });

        //Verificar clave        
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        //Verificar clave
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'Clave no valida'
            });
        }

        const token = await generarJWT(usuarioDB.id);

        res.status(500).json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const loginGoogle = async ( req, res = response ) => {

    try {
        const { email, name, picture } = await googleVerify( req.body.token );   
        
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            email, name, picture,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })        
    }

}

module.exports = {
    login,
    loginGoogle
}