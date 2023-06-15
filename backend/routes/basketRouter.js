const Router = require('express')

const router = new Router()

const basketController = require('../controllers/userBasketController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', basketController.getBasket);
router.post('/create',authMiddleware, basketController.addDeviceToBasket)
router.delete('/delete', basketController.remove)

module.exports = router

//, checkRole('USER')