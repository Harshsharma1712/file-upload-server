
# File Upload Server

A lightweight and secure **file-sharing backend** built with **Express.js**, **Drizzle ORM**, and **Neon PostgreSQL**.
This server allows users to **upload files**, store them securely with **ImageKit.io**, and generate **download links** accessible across devices using **LocalTunnel**.

---

## Features

* **JWT Authentication** — Secure user access and session handling.
*  **Upload up to 10 files** per request.
*  **Supports image uploads** (more file types coming soon).
*  **Cloud-based storage** via ImageKit.io — file URLs stored in database.
*  **Cross-device access** — expose localhost using LocalTunnel to share files easily.
* **Drizzle ORM + Neon PostgreSQL** — type-safe, fast, and reliable data layer.

---

## Tech Stack

* Express.js 
* Json Web Token
* Postgressql
* Drizzle ORM
* ImageKit


---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Harshsharma1712/file-upload-server.git
cd file-upload-server
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# PORT number
PORT=

# nenon postgres database url
DATABASE_URL=""

# Auth(jwt) config
JWT_SECRET=
JWT_EXPIRES_IN=

# Imagejit config 
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

```

### Run Database Migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate

or

npx drizzle-kit push 
```

### Start the Server

```bash
npm run dev
```

Your API will now be available at:

```
http://localhost:5000
```

---

## Expose Locally with LocalTunnel

To share files across devices, expose your local server using [LocalTunnel](https://localtunnel.github.io/www/):

Create a new terminal

```bash
npm install -g localtunnel
```

You will also need to get the password of the tunnel which you can get the instruction from the webpage once you go to public url
then run 

```bash
lt --port 8000
```

Make sure in another terminal, the project server is running.

You’ll get a public URL — share this with other users to allow them to download files.

---

## API Endpoints

### **Authentication**

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| `POST` | `api/auth/register` | Register a new user          |
| `POST` | `api/auth/login`    | Log in and receive JWT token |

### **File Upload**

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| `POST` | `api/files/upload` | Upload up to 10 image files |
| `GET` | `api/files/` | Get the the all files for user |
| `GET` | `api/download/:id/` | Return image so user can download |

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

---

---

## Future Improvements

* Support for non-image files (PDFs, ZIPs, etc.)
* File size limit configuration
* Expiring download links
* Admin panel for managing uploads

---

## Contributing

Pull requests are welcome! If you’d like to improve this project, please fork the repo and create a new branch for your feature or fix.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and modify for your own purposes.

---