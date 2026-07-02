module.exports = {
    networks: {
      development: {
        host: "127.0.0.1", // Localhost (default: ganache)
        port: 7545, // Ganache GUI port (default: 7545)
        network_id: "*", // Any network ID
      },
    },
    compilers: {
      solc: {
        version: "0.8.0", // Specify the Solidity compiler version
      },
    },
  };
  