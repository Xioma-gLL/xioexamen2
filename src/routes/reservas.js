const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reservasController');
const upload  = require('../middleware/upload');

router.get('/',           ctrl.listar);
router.get('/nuevo',      ctrl.formCrear);
router.post('/',          upload.single('comprobante_img'), ctrl.crear);
router.get('/:id/editar', ctrl.formEditar);
router.put('/:id',        upload.single('comprobante_img'), ctrl.actualizar);
router.delete('/:id',     ctrl.eliminar);

module.exports = router;
