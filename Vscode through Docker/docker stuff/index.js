const express = require("express");
const Docker = require("dockerode");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");

const app = express();
const docker = new Docker();

const BASE_PORT = 8000;
const BASE_WORKSPACE = "C:\\Users\\parde\\Cloud9Workspaces"; // Adjust this to your desired path

app.use(express.json());
app.use(cors());

app.post("/create-workspace", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Check if container already exists
    const containers = await docker.listContainers({ all: true });
    const existingContainer = containers.find((container) =>
      container.Names.includes(`/cloud9-${username}`)
    );

    if (existingContainer) {
      // Container exists, get its port
      const port = existingContainer.Ports.find(
        (p) => p.PrivatePort === 8000
      )?.PublicPort;

      if (!port) {
        throw new Error(
          "Existing container found but port information is missing"
        );
      }

      // Start the container if it's not running
      if (existingContainer.State !== "running") {
        const container = docker.getContainer(existingContainer.Id);
        await container.start();
      }

      return res
        .status(200)
        .json({ port, message: "Existing workspace found" });
    }

    // Create user workspace if it doesn't exist
    const userWorkspace = path.join(BASE_WORKSPACE, username);
    await fs.mkdir(userWorkspace, { recursive: true });

    // Find an available port
    let port = BASE_PORT;
    const usedPorts = containers
      .map((container) => {
        const ports = container.Ports;
        return ports.length > 0 ? parseInt(ports[0].PublicPort) : null;
      })
      .filter(Boolean);
    while (usedPorts.includes(port)) {
      port++;
    }

    // Create and start the container
    const container = await docker.createContainer({
      Image: "hoadx/cloud9:slim",
      name: `cloud9-${username}`,
      Env: [`USERNAME=${username}`, `PASSWORD=${password}`],
      HostConfig: {
        PortBindings: { "8000/tcp": [{ HostPort: port.toString() }] },
        Binds: [`${userWorkspace.replace(/\\/g, "/")}:/workspace`],
      },
    });

    await container.start();

    res.status(201).json({ port, message: "New workspace created" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({
        error: "Failed to create or retrieve workspace",
        details: error.message,
      });
  }
});

app.listen(7100, () => {
  console.log("Server running on port 3000");
});
