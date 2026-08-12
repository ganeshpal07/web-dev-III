const http = require("http");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const dns = require("dns");
const cities = require("./data/data.js");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MAX_BODY_SIZE = 1024 * 1024;

const students = [
  { id: 1, name: "Alice", course: "Node.js", grade: "A" },
  { id: 2, name: "Bob", course: "Node.js", grade: "B" },
  { id: 3, name: "Charlie", course: "Node.js", grade: "A+" }
];

switch (process.argv[2]) {
  case "lecture3":
    runLecture3();
    break;
  case "lecture4":
    runLecture4();
    break;
  case "lecture5":
    runLecture5().catch(handleLessonError);
    break;
  case "lecture6":
    runLecture6();
    break;
  default:
    startServer();
}

function runLecture3() {
  const courseName = process.argv[3] || "Web Development III";

  console.log("Hello, Node.js!");
  console.log(`Welcome to ${courseName}`);
  console.log(greet("Alice"));
}

function greet(studentName) {
  return `Hello, ${studentName}! Ready to learn Node.js?`;
}

function runLecture4() {
  console.table(cities);
  console.log(`Total cities: ${cities.length}`);
}

async function runLecture5() {
  const lessonFile = path.join(__dirname, "data", "test.txt");
  const temporaryFile = path.join(os.tmpdir(), "node-core-modules-demo.txt");
  const fileText = fs.readFileSync(lessonFile, "utf8");
  const asyncFileText = await fsPromises.readFile(lessonFile, "utf8");
  const hash = crypto.createHash("sha256").update(fileText).digest("hex");

  console.log("Platform:", os.platform());
  console.log("Architecture:", os.arch());
  console.log("Host name:", os.hostname());
  console.log("Home directory:", os.homedir());
  console.log("Temporary directory:", os.tmpdir());
  console.log("CPU cores:", os.cpus().length);
  console.log("Free memory:", os.freemem());
  console.log("Total memory:", os.totalmem());
  console.log("System uptime:", os.uptime());
  console.log("File path:", lessonFile);
  console.log("Resolved path:", path.resolve("data", "test.txt"));
  console.log("Base name:", path.basename(lessonFile));
  console.log("Directory name:", path.dirname(lessonFile));
  console.log("Extension:", path.extname(lessonFile));
  console.log("Synchronous file text:", fileText);
  console.log("Promise file text:", asyncFileText);
  console.log("SHA-256:", hash);
  console.log("Random UUID:", crypto.randomUUID());

  fs.readFile(lessonFile, "utf8", (error, callbackFileText) => {
    if (error) {
      console.error("File error:", error.message);
      return;
    }

    console.log("Callback file text:", callbackFileText);
  });

  await fsPromises.writeFile(temporaryFile, "Node.js core modules\n");
  await fsPromises.appendFile(temporaryFile, "File system example\n");
  console.log("Temporary file text:", await fsPromises.readFile(temporaryFile, "utf8"));
  await fsPromises.unlink(temporaryFile);

  dns.lookup("google.com", (error, address, family) => {
    if (error) {
      console.error("DNS error:", error.message);
      return;
    }

    console.log(`google.com: ${address} (IPv${family})`);
  });

  dns.reverse("8.8.8.8", (error, hostnames) => {
    if (error) {
      console.error("Reverse DNS error:", error.message);
      return;
    }

    console.log("8.8.8.8 hostnames:", hostnames);
  });
}

function runLecture6() {
  console.log("Node version:", process.version);
  console.log("Platform:", process.platform);
  console.log("Process ID:", process.pid);
  console.log("Current working directory:", process.cwd());
  console.log("Arguments:", process.argv.slice(3));
  console.log("PORT:", process.env.PORT);

  process.on("exit", (code) => {
    console.log(`Process exited with code ${code}`);
  });
}

function startServer() {
  const server = http.createServer((req, res) => {
    const { method, url } = req;

    console.log(`${method} ${url}`);

    if (method === "GET" && url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<h1>Welcome to Node.js!</h1>");
      res.write("<p>Your HTTP server is running.</p>");
      res.end();
      return;
    }

    if (method === "GET" && url === "/api/students") {
      sendJson(res, 200, { count: students.length, students });
      return;
    }

    if (method === "GET" && url === "/api/students/count") {
      sendJson(res, 200, { count: students.length });
      return;
    }

    if (method === "POST" && url === "/api/students") {
      createStudent(req, res);
      return;
    }

    if (url === "/api/students") {
      sendJson(res, 405, { error: `Method ${method} is not allowed` }, { Allow: "GET, POST" });
      return;
    }

    sendJson(res, 404, { error: "Not Found" });
  });

  server.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

function createStudent(req, res) {
  const contentType = req.headers["content-type"] || "";

  if (!contentType.includes("application/json")) {
    sendJson(res, 415, { error: "Content-Type must be application/json" });
    return;
  }

  let rawBody = "";
  let bodySize = 0;
  let bodyTooLarge = false;

  req.on("data", (chunk) => {
    bodySize += chunk.length;

    if (bodySize > MAX_BODY_SIZE) {
      bodyTooLarge = true;
      return;
    }

    rawBody += chunk;
  });

  req.on("end", () => {
    if (bodyTooLarge) {
      sendJson(res, 413, { error: "Payload too large" });
      return;
    }

    try {
      const body = JSON.parse(rawBody);

      if (!body.name || !body.course) {
        sendJson(res, 400, { error: "name and course are required" });
        return;
      }

      const student = {
        id: students.length + 1,
        name: body.name,
        course: body.course,
        grade: body.grade || "Not graded"
      };

      students.push(student);
      sendJson(res, 201, { message: "Student created", student });
    } catch (error) {
      sendJson(res, 400, { error: "Invalid JSON body" });
    }
  });

  req.on("error", (error) => {
    console.error(error.message);

    if (!res.headersSent) {
      sendJson(res, 400, { error: "Could not read request body" });
    }
  });
}

function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(data));
}

function handleLessonError(error) {
  console.error(error.message);
  process.exitCode = 1;
}
