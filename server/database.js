const mongoose = require("mongoose");

class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log("MongoDB already connected");
      return this.connection;
    }

    try {
      console.log("Connecting to MongoDB...");
      this.connection = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      this.isConnected = true;
      console.log(" Connected to MongoDB successfully!");
      
      // Handle connection events
      mongoose.connection.on("error", (error) => {
        console.error(" MongoDB connection error:", error);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log(" MongoDB disconnected");
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        console.log(" MongoDB reconnected");
        this.isConnected = true;
      });

      return this.connection;
    } catch (error) {
      console.error(" MongoDB connection failed:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (this.connection && this.isConnected) {
      try {
        await mongoose.connection.close();
        this.isConnected = false;
        console.log(" MongoDB connection closed");
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
      }
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnectionReady() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Export singleton instance
module.exports = new DatabaseConnection();
