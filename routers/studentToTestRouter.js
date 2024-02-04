const router = require('express').Router()
const studentToTestBL = require('../controllers/studentToTestBL')


router.post('/',studentToTestBL.createStudentToTest)
router.get('/:subjectId',)
router.get('/test/:id',studentToTestBL.getStudentToTestById)
router.put('/test',studentToTestBL.getTestBySubjectAndStudentId)
router.put('/',studentToTestBL.updateMark)

module.exports = router