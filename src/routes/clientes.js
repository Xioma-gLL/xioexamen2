const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/clientesController');

router.get('/',           ctrl.listar);
router.get('/nuevo',      ctrl.formCrear);
router.post('/',          ctrl.crear);
router.get('/:id/editar', ctrl.formEditar);
router.put('/:id',        ctrl.actualizar);
router.delete('/:id',     ctrl.eliminar);

module.exports = router;
