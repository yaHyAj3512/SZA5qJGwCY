// 代码生成时间: 2025-09-20 07:51:55
const Hapi = require('@hapi/hapi');
const axios = require('axios');

// 创建 HAPI 服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 异步函数用于检查网络连接状态
async function checkNetworkStatus(url) {
    try {
        const response = await axios.head(url);
        return {
            status: 'connected',
            message: `Successfully connected to ${url}`,
            statusCode: response.status
        };
    } catch (error) {
        if (error.code === 'ENOTFOUND') {
            return {
                status: 'not connected',
                message: `Unable to connect to ${url}. Check the URL and network connectivity.`,
                statusCode: 503
            };
        } else {
            return {
                status: 'not connected',
                message: 'An error occurred while checking for network connectivity.',
                statusCode: 500
            };
        }
    }
}

// 路由处理函数，用于处理 GET 请求并检查网络连接状态
const checkNetworkStatusRoute = {
    method: 'GET',
    path: '/network-status/{url}',
    handler: async (request, h) => {
        const { url } = request.params;
        const result = await checkNetworkStatus(url);
        return h.response(result).code(result.statusCode);
    }
};

// 启动服务器并添加路由
async function start() {
    await server.register(Hapi.plugins.vision);
    await server.route(checkNetworkStatusRoute);
    await server.start();
    console.log('Server running on %s', server.info.uri);
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
