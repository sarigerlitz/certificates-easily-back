const router = require('express').Router()
const testBL = require('../controllers/testBL')


router.post('/',testBL.createTest)
router.get('/:subjectId',testBL.getTestBySubject)
router.get('/test/:id',testBL.getTestById)
router.put('/',testBL.updateTest)
router.delete('/:id',testBL.deleteTest)

module.exports = router