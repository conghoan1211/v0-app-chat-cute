import mongoose from "mongoose";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: typeof mongoose | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected && this.connection) {
      console.log("MongoDB already connected");
      return this.connection;
    }

    try {
      console.log("Connecting to MongoDB...");
      this.connection = await mongoose.connect(
        process.env.MONGODB_URI as string,
        {
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
          dbName: "chatting",
        }
      );

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

  public async disconnect(): Promise<void> {
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

  public getConnection(): typeof mongoose | null {
    return this.connection;
  }

  public isConnectionReady(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Export singleton instance
export default DatabaseConnection.getInstance();
