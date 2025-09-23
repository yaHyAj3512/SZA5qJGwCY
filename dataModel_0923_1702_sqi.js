// 代码生成时间: 2025-09-23 17:02:07
// DataModel.js
const Joi = require('joi');

// 数据模型设计
// User数据模型
const UserSchema = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
    created_at: Joi.date().iso()
}).required();

// 导出User数据模型
module.exports = {
    UserSchema
};