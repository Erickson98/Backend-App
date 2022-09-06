const { Router } = require('express')
const {
  createPerson,
  getPerson,
  updatePerson,
  deletePerson,
} = require('../controllers/Person.controllers.js')

const router = Router()

router.post('/Person', createPerson)
router.get('/Person', getPerson)
router.put('/Person/:_id', updatePerson)
router.delete('/Person/:_id', deletePerson)
module.exports = router
