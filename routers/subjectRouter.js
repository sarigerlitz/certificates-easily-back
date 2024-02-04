const router = require('express').Router()
const subjectBL = require('../controllers/subjectBL')


router.post('/',subjectBL.createSubject)
router.get('/',subjectBL.getAllSubject)
router.put('/',)
router.delete('/:id',)

module.exports = router