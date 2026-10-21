# Web Technology Practicals

All practical codes are organized by practical number. The code files contain no comments.

## Download practicals with the `wt` command

The project includes a command-line downloader. It copies the selected practical and all required supporting files into the current folder, or into a folder chosen with `--dir`. The CLI requires Node.js 18 or newer.

Local usage:

```
node bin/wt.js 5
node bin/wt.js 18 --dir downloaded
node bin/wt.js 23
node bin/wt.js 24C
node bin/wt.js 25E
node bin/wt.js --list
```

Use `wt 23`, `wt 24`, or `wt 25` to download every part of a multi-part practical.

For a local `wt` command, run `npm link` once in this folder, then use `wt 5`.

Options:

```
-d, --dir <folder>  Destination folder
-f, --force         Overwrite files that already exist with different content
-l, --list          List all practical numbers
-h, --help          Show help
```

### Publish for world-wide access

Create a public GitHub repository named `wt-practicals` at `https://github.com/new?name=wt-practicals`, then run these commands from this folder:

```
git init
git add .
git commit -m "Add Web Technology practicals and CLI"
git branch -M main
git remote add origin https://github.com/ashaz-ansari/wt-practicals.git
git push -u origin main
```

After the repository is public, anyone with Node.js and npm can download a practical from any folder:

```
npx --yes github:ashaz-ansari/wt-practicals 5
```

Examples:

```
npx --yes github:ashaz-ansari/wt-practicals 18 --dir downloaded
npx --yes github:ashaz-ansari/wt-practicals 24C
npx --yes github:ashaz-ansari/wt-practicals --list
```

Or install the command once:

```
npm install -g github:ashaz-ansari/wt-practicals
wt 5
```

The repository must be public. If it is private, npm needs GitHub authentication.

## Browser practicals

Open `index.html` directly, or start the included static server:

```
node serve.js
```

Then open:

```
http://localhost:8000
```

The local server is recommended for the AJAX and XML practicals because browsers block local file requests made with `file://`.

## Practical 22: XML web service

The main server includes the SOAP endpoint, so this practical works at:

```
http://localhost:8000/practical-22-xml-web-services/
```

To run the standalone XML web service instead:

```
node practical-22-xml-web-services/service.js
```

Open `http://localhost:4000`.

## Practical 23: Node environment and async events

```
node practical-23-node-environment/environment.js
node practical-23-node-environment/async-events.js
```

## Practical 24: Streams, file system, and Express

```
node practical-24-node-streams-fs-express/streams-server.js
node practical-24-node-streams-fs-express/file-system.js
```

Open `http://localhost:3000` for the streams server.

For the Express application:

```
cd practical-24-node-streams-fs-express/express-app
npm install
npm start
```

Open `http://localhost:3000`.

The streams server, Express application, and MongoDB CRUD API all use port 3000, so run only one of them at a time.

## Practical 25: Databases

Run the script in `practical-25-databases/sql/schema.sql` using MySQL Workbench or the MySQL command line.

For MySQL from Node.js, update the database credentials in `practical-25-databases/mysql/app.js`, then run:

```
cd practical-25-databases/mysql
npm install
npm start
```

For MongoDB, start a local MongoDB server, then run:

```
cd practical-25-databases/mongodb
npm install
npm run native
npm run mongoose
npm run api
```

The CRUD API runs at `http://localhost:3000/students`.

CRUD routes:

```
GET    /students
GET    /students/:id
POST   /students
PUT    /students/:id
DELETE /students/:id
```

Send JSON such as `{"name":"Aarav","course":"Web Technology","marks":88}` in the request body.
