// Importing the 'Hapi' module
const Hapi = require("@hapi/hapi");

// Importing the defined routes from the 'routes' module
const routes = require("./routes");

// Definition of an asynchronous function named 'init'
const init = async () => {
  // Creating a new Hapi server instance with configuration
  const server = Hapi.server({
    // Setting the port number for the server to listen on
    port: 9000,
    // Setting the host address for the server to bind to
    host: "localhost",
    // Configuring CORS (Cross-Origin Resource Sharing) for the server routes
    routes: {
      cors: {
        origin: ["*"], // Allowing requests from any origin
      },
    },
  });

  // Adding the defined routes to the server
  server.route(routes);

  // Starting the server asynchronously
  await server.start();
  // Logging the server's URI (Uniform Resource Identifier) upon successful start
  console.log(`Server ini berjalan pada ${server.info.uri}`);
};

// Calling the 'init' function to initialize and start the server
init();
