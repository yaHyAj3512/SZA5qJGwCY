// 代码生成时间: 2025-10-13 02:42:31
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000,
});

// Register Inert and Vision plugins to serve static files and templates
async function start() {
  await server.register(Inert);
  await server.register(Vision);
  await server.views({
    engines: { html: Handlebars },
    relativeTo: __dirname,
    path: './views',
  });

  // Define routes
  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return h.view('index');
    },
  });

  server.route({
    method: 'POST',
    path: '/build-graph',
    options: {
      validate: {
        payload: Joi.object({
          nodes: Joi.array().required(),
          edges: Joi.array().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        // Extract nodes and edges from the payload
        const { nodes, edges } = request.payload;

        // Construct the knowledge graph
        const graph = buildGraph(nodes, edges);

        // Return the constructed graph
        return {
          status: 'success',
          graph,
        };
      } catch (error) {
        // Handle any errors that occur during graph construction
        return {
          status: 'error',
          message: error.message,
        };
      }
    },
  });

  await server.start();
  console.log('Server running at:', server.info.uri);
}

// Function to build a knowledge graph from nodes and edges
function buildGraph(nodes, edges) {
  // Initialize an empty graph
  const graph = new Map();

  // Add nodes to the graph
  nodes.forEach(node => {
    graph.set(node.id, {
      ...node,
      edges: new Set(),
    });
  });

  // Add edges to the graph
  edges.forEach(edge => {
    const { source, target } = edge;
    if (graph.has(source) && graph.has(target)) {
      graph.get(source).edges.add(target);
      graph.get(target).edges.add(source);
    }
  });

  // Return the constructed graph
  return graph;
}

// Call the start function to begin the server
start().catch(console.error);

// Export the buildGraph function for testing or other purposes
module.exports = {
  buildGraph,
};