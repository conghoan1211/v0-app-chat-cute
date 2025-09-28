const { spawn } = require("child_process")
const path = require("path")

console.log("🚀 Starting Cute Chat App in development mode...\n")

// Start server
console.log("📡 Starting WebSocket server...")
const server = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "..", "server"),
  stdio: "inherit",
  shell: true,
})

// Wait a bit then start client
setTimeout(() => {
  console.log("💻 Starting Next.js client...")
  const client = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  })

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down...")
    server.kill()
    client.kill()
    process.exit()
  })
}, 2000)
