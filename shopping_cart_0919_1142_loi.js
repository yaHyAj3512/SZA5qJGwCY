// 代码生成时间: 2025-09-19 11:42:33
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

// 创建服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

// 用于存储购物车中的商品
const cart = {
  "cartId1": [{
    "id": 1,
    "name": "Apple",
    "quantity": 2,
  }, {
    "id": 2,
    "name": "Banana",
    "quantity": 3,
  }],
  "cartId2": [{
    "id": 3,
    "name": "Cherry",
    "quantity": 5,
  }],
};

// 获取购物车
const getCart = async (request, h) => {
  const { cartId } = request.params;
  if (!cart[cartId]) {
    throw Boom.notFound(`Cart with ID ${cartId} not found`);
  }
  return { cart: cart[cartId] };
};

// 添加商品到购物车
const addToCart = async (request, h) => {
  const { cartId } = request.params;
  const { id, name, quantity } = request.payload;

  if (!cart[cartId]) {
    cart[cartId] = [];
  }

  const existingItem = cart[cartId].find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart[cartId].push({ id, name, quantity });
  }

  return { cart: cart[cartId] };
};

// 初始化服务器路由
const init = async () => {
  await server.route([
    {
      method: 'GET',
      path: '/cart/{cartId}',
      handler: getCart,
    },
    {
      method: 'POST',
      path: '/cart/{cartId}',
      handler: addToCart,
    },
  ]);
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 调用初始化函数
init();

// 错误处理
server.ext('onPreResponse', (request, h) => {
  const response = request.response;
  if (response.isBoom) {
    return h.response({
      statusCode: response.output.statusCode,
      error: response.output.payload.error,
      message: response.output.payload.message,
    }).code(response.output.statusCode);
  }
  return h.continue;
});
