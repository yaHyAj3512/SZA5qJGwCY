// 代码生成时间: 2025-10-12 16:41:52
const Hapi = require('@hapi/hapi');

// Create a new Hapi server
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// Define the route for calculating salary
server.route({
  method: 'POST',
  path: '/calculateSalary',
  handler: async (request, h) => {
    try {
      // Extract salary parameters from request payload
      const { baseSalary, hoursWorked, hourlyRate } = request.payload;

      // Validate input parameters
      if (baseSalary === undefined || hoursWorked === undefined || hourlyRate === undefined) {
        return h.response({
          status: 'error',
          message: 'Base salary, hours worked, and hourly rate are required.'
        }).code(400);
      }

      // Calculate total salary
      // Total salary = base salary + (hours worked * hourly rate)
      const totalSalary = baseSalary + (hoursWorked * hourlyRate);

      // Return the calculated salary
      return {
        status: 'success',
        totalSalary: totalSalary
      };

    } catch (error) {
      // Handle any unexpected errors
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  }
});

// Start the server
async function start() {
  await server.start();
  console.log('Server running at:', server.info.uri);
}

start();
