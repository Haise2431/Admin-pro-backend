const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
     
    const [ usuarios, total] = await Promise.all([
        Usuario
        .find({}, 'nombre email role google img')
        .skip(desde)
        .limit( 5 ),
        Usuario.countDocuments()
    ])

    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password, nombre } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            }); 
        }

        const usuario = new Usuario( req.body );

        // Encriptar clave
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        const token  = await generarJWT(usuario.id);

        
    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch ( error ) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado... revisar logs'
        });
    }


}

const actualizarUsuario = async (req, res = response) => {

    //TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id
    
    try {


        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const campos = req.body;

        if ( usuarioDB.email === req.body.email ) {
          delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne({ email: req.body.email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con este email'
                });
            }
        }

      
        delete campos.password;
        delete campos.google;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true} );


        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        })

    }
}

const eliminarUsuario = async (req, res = response ) => {

    //TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id

    try {
        
        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
}



module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}