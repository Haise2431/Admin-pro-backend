/*
  Hospitales
  /api/hospitales
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medico')

const router = Router();

router.get( '/', [], getMedicos);

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
  check('hospital', 'El hospital id debe ser valido').isMongoId()
], crearMedico);

router.put('/:id', [],actualizarMedico);

router.delete('/:id', [], borrarMedico);

module.exports = router;