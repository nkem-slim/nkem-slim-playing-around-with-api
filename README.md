# React Firebase Application

## Overview

This project is a React web application that integrates Firebase for user authentication and Firestore for storing and managing user data. The application enables users to sign in, manage their profiles, and interact with data stored in Firestore, supporting features like sorting, filtering, or searching user-related data. It provides a practical solution for user data management with a secure and intuitive interface, leveraging Firebase's backend services.

### External APIs Used

- **Firebase Authentication:** For secure user login and registration.
- **Firestore:** For storing and retrieving user data.

---

## Live URL

[Live Demo](https://nvn-ocr.vercel.app/login)

---

## Demo Video

[Video Demo]([https://nvn-ocr.vercel.app/login](https://www.loom.com/share/16c1d9dcdeab4a8d8b4479f869e69892?sid=05deb38b-db63-4435-8400-914cdb965793))

---

## Docker Image Details

- **Docker Hub Repository:** https://hub.docker.com/repositories/nkemakolamuko
- **Image Name 1:** `nkemakolamuko/tesseract-ocr-web-01:v1`
- **Image Name 1:** `nkemakolamuko/tesseract-ocr-web-02:v1`
- **Image Name 1:** `nkemakolamuko/tesseract-ocr-lb-01:v1`
- **Tags:** `v1`

---

## Prerequisites

- Docker and Docker Compose installed on your host machine (Linux recommended).
- Internet access to pull base images and dependencies.
- (Optional) Docker Desktop if you want a GUI, but use the same context as your CLI.

---

## Build & Run Instructions

### 1. Clone the Repository

```sh
git clone <repo-url>
cd tesseract-ocr
```

### 2. Build the Frontend

```sh
npm install
npm run build
```

This will generate the `dist/` folder.

### 3. Build and Start the Docker Containers

```sh
sudo docker compose up -d --build
```

> If you use Docker Desktop, you can omit `sudo` and ensure your context is set to `desktop-linux`.

### 4. Verify Running Containers

```sh
sudo docker ps
```

You should see `web-01`, `web-02`, and `lb-01` running.

---

## Accessing the Application

- **Direct Access to Web Servers:**

  - [http://localhost:8080](http://localhost:8080) → web-01
  - [http://localhost:8081](http://localhost:8081) → web-02

- **Load Balanced Access:**
  - [http://localhost:8082](http://localhost:8082) → HAProxy load balancer (lb-01)

---

## Load Balancer Configuration

The load balancer (`lb-01`) uses HAProxy and is pre-configured to round-robin between web-01 and web-02:

```haproxy
backend servers
    balance roundrobin
    server web01 172.30.0.11:80 check
    server web02 172.30.0.12:80 check
```

---

## Testing Load Balancing

From your host, run:

```sh
curl http://localhost:8082
```

Run the above command multiple times. You should see the `x-served-by` header alternate between `web01` and `web02`, confirming round-robin load balancing.

---

## SSH Access (Optional)

You can SSH into any container for debugging:

```sh
ssh -p 2210 ubuntu@localhost   # lb-01
ssh -p 2211 ubuntu@localhost   # web-01
ssh -p 2212 ubuntu@localhost   # web-02
```

Default password: `pass123`

---

## Environment Variables

- The application uses embedded Firebase configuration for demonstration.
- (Optional) You can set the Nginx port with the `PORT` environment variable.

---

## Troubleshooting

- If you see a "Pool overlaps with other one on this address space" error, change the subnet in `compose.yml` under `networks:lablan:ipam:config:subnet` to a unique value (e.g., `172.30.0.0/24`).
- If you get SSH host key warnings, remove the offending key with:
  ```sh
  ssh-keygen -f "$HOME/.ssh/known_hosts" -R '[localhost]:PORT'
  ```

---

---

## Credits

- [Firebase](https://firebase.google.com/)
- [React](https://reactjs.org/)
- [Nginx](https://nginx.org/)
- [Docker](https://www.docker.com/)
- [Lab Setup](https://github.com/waka-man/web_infra_lab)
