const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket, BasketDevice} = require('../models/models')

const generateJwt = (id, email, username, role) => {
  return jwt.sign(
    {id, email, username, role},
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
    )
}


class UserController {
  async registration (req, res, next){
    const {email, password, username, role} = req.body
    if(!email || !password){
      return next(ApiError.badRequest('Некоректний email або password'))
    }
    const candidate = await User.findOne({where: {email}})
    if(candidate){
      return next(ApiError.badRequest('Користувач з таким Email вже існує'))
    }
    const candidateName = await User.findOne({where: {username}})
    if(candidateName){
      return next(ApiError.badRequest('Користувач з таким User Name вже існує'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({email, role, username, password: hashPassword})
    const basket = await Basket.create({userId: user.id})
      

    const token = generateJwt(user.id, user.email, user.username, user.role)
      return res.json({token})
  }
  async login (req, res, next){
    const {username, password} = req.body
    const user = await User.findOne({where: {username}})
    if(!user){
      return next(ApiError.internal('Коритсувача не найдено'))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if(!comparePassword){
      return next(ApiError.badRequest('Не вірний пароль'))
    }
    const token = generateJwt(user.id, user.email, user.username, user.role)
    return res.json({token})
  }
  async check (req, res, next){

    let userData = {userName: req.user.username, userRole: req.user.role, userEmail: req.user.email, userId: req.user.id}
    let basket = await Basket.findOne({id: req.user.id})
    const token = generateJwt(req.user.id, req.user.email, req.user.username, req.user.role)
    return res.json({token, userData, basket})
  }

  async delete (req, res){
    
  }
}

module.exports = new UserController()