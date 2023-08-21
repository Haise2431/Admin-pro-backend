const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path ) => {

    if ( fs.existsSync( path )) {
        //borrar imagen anterior
        fs.unlinkSync( path );
    }

}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if ( !medico ) {
                return false;
            }

            borrarImagen(`./uploads/medicos/${medico.img}`);
            
            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;
        case 'hospitales':
            const hospitales = await Hospital.findById(id);
            if ( !hospitales ) {
                return false;
            }

            borrarImagen(`./uploads/hospitales/${hospital.img}`);
            
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;            
        break;
        case 'usuarios':
            const usuarios = await Usuario.findById(id);
            if ( !usuarios ) {
                return false;
            }

            borrarImagen(`./uploads/usuarios/${usuario.img}`);
            
            usuario.img = nombreArchivo;
            await usuario.save();
            return true; 
        break;
        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}