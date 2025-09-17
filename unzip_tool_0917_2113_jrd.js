// 代码生成时间: 2025-09-17 21:13:27
const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const multipartParser = require('hapijs-multipart-parser');

// Create a server
const server = Hapi.server({
    host: 'localhost',
    port: 3000,
});

// Route options for file upload
const uploadOptions = {
    payload: {
        output: 'stream',
        parse: false,
        maxBytes: 1024 * 1024 * 1024 // 1 GB max upload size
    },
    plugins: {
        'hapijs-multipart-parser': {
            output: 'stream',
            parse: false
        }
    },
    // Validate the payload
    validate: multipartParser.validate({
        type: 'application/octet-stream'
    })
};

// Route handler for uploading and unzipping files
const handleUploadAndUnzip = async (request, h) => {
    try {
        // Get the file from the request
        const file = request.payload.file;

        // Ensure the file is not empty
        if (!file) {
            return h.response('No file received').code(400);
        }

        // Prepare the destination path
        const destinationPath = path.join(__dirname, 'extracted', path.basename(file.filename));

        // Ensure the destination directory exists
        fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

        // Pipe the file stream to the unzipper and extract to the destination path
        await file.pipe(unzipper.Extract({ path: path.dirname(destinationPath) })).catch(error => {
            throw h.response(`Error extracting file: ${error.message}`).code(500);
        });

        // Return success response
        return h.response('File uploaded and extracted successfully').code(200);
    } catch (error) {
        // Handle any errors that occurred
        return h.response(error.toString()).code(500);
    }
};

// Add the route for file upload and extraction
server.route({
    method: 'POST',
    path: '/upload',
    options: uploadOptions,
    handler: handleUploadAndUnzip
});

// Start the server
async function start() {
    await server.start();
    console.log('Server running at:', server.info.uri);
}

start();
