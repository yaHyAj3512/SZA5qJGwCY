// 代码生成时间: 2025-10-03 23:06:40
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('joi');

// 商品搜索引擎类
class ProductSearchEngine {
  constructor() {
    this.server = Hapi.server({
      port: 3000,
      host: 'localhost'
    });
    this.products = [
      { id: 1, name: 'Apple', category: 'Fruit', price: 1.99 },
      { id: 2, name: 'Banana', category: 'Fruit', price: 0.99 },
      { id: 3, name: 'Carrot', category: 'Vegetable', price: 2.99 },
      { id: 4, name: 'Spinach', category: 'Vegetable', price: 3.99 }
    ];
  }

  async start() {
    try {
      await this.server.register(require('vision'));
      await this.server.views({
        engines: { html: require('handlebars') },
        relativeTo: __dirname,
        path: 'views',
        layoutPath: 'layouts',
        layout: 'default',
        partialsPath: 'partials',
        helpersPath: 'helpers'
      });

      this.server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
          return h.view('index', { products: this.products });
        }
      });

      this.server.route({
        method: 'GET',
        path: '/search',
        handler: async (request, h) => {
          const { query } = request.query;
          const filteredProducts = this.products.filter(product => product.name.includes(query));
          return h.view('search', { products: filteredProducts });
        }
      });

      await this.server.start();
      console.log('Server running on %s', this.server.info.uri);
    } catch (err) {
      console.error(err);
    }
  }
}

// 商品搜索路由的请求验证
const searchValidation = {
  query: Joi.object({
    query: Joi.string().min(1).required()
  })
    .unknown()
    .label('Search Query')
};

// 创建并启动商品搜索引擎
const productSearchEngine = new ProductSearchEngine();
productSearchEngine.start();