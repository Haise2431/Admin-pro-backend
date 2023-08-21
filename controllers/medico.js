const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre')
                                .populate('hospital', 'nombre')
                              
                                
    res.json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    
    const medico = new Medico({
        usuario: uid,        
        ...req.body
    })

    const medicoDB = await medico.save();


    res.json({
        ok: true,
        medico: medicoDB
    });
}

const actualizarMedico = (req, res) => {
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    });
}

const borrarMedico = (req, res) => {
    res.json({
        ok: true,
        msg: 'borrarMedico'
    });
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,    
    borrarMedico
}