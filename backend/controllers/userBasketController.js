const { Basket, Device, BasketDevice } = require('../models/models');
const ApiError = require('../error/ApiError');

class UserBasketController {
  async addDeviceToBasket(req, res, next) {
   let { basketId, deviceId } = req.body
   let basketDevice = await BasketDevice.create({basketId, deviceId})
   return res.json(basketDevice)
  }
  async getBasket(req, res, next){
 
    let {basketId} = req.query;

    let devices = await BasketDevice.findAndCountAll({where: {basketId}})
    return res.json(devices);
  } 
  async remove(req, res){
    const id = req.query; 

    
    await BasketDevice.destroy({ where: id});

    res.sendStatus(204)
  }
}



module.exports = new UserBasketController();
