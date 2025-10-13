// 代码生成时间: 2025-10-13 16:27:01
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const ffmpeg = require('fluent-ffmpeg');
const Writable = require('stream').Writable;

// 创建 ffmpeg 流的类
class FFmpegStream extends Writable {
    constructor(options) {
        super(options);
        this.ffmpeg = ffmpeg()
            .input('pipe:')
            .output('pipe:', { end: true })
            .on('error', console.error)
            .on('end', () => this.destroy());
    }

    _write(chunk, encoding, callback) {
        this.ffmpeg.write(chunk);
        callback();
    }

    _destroy(err, callback) {
        this.ffmpeg.kill();
        callback(err);
    }
}

// 创建 Hapi 服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 推流器路由
    server.route({
        method: 'POST',
        path: '/stream',
        handler: async (request, h) => {
            try {
                // 验证输入数据
                const { stream } = request.payload;
                await Joi.validate({ stream }, Joi.object({ stream: Joi.string().required() }).unknown().required());

                // 创建 ffmpeg 流
                const ffmpegStream = new FFmpegStream();

                // 将接收到的流推送到 ffmpeg 进程
                stream.pipe(ffmpegStream)
                    .on('error', (err) => console.error('Stream error:', err));

                return h.response('Stream started successfully').code(200);
            } catch (error) {
                // 错误处理
                return h.response(error.message).code(400);
            }
        },
        config: {
            payload: {
                parse: 'multipart/form-data',
                maxBytes: 5242880 // 5MB limit
            },
            validate: {
                payload: Joi.object({
                    stream: Joi.string().required()
                })
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// 启动服务器
init();