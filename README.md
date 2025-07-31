React Firebase Application
Overview
This project is a React web application that integrates Firebase for user authentication and Firestore for storing and managing user data. The application enables users to sign in, manage their profiles, and interact with data stored in Firestore, supporting features like sorting, filtering, or searching user-related data. It provides a practical solution for user data management with a secure and intuitive interface, leveraging Firebase's backend services.

External APIs Used:
Firebase Authentication: For secure user login and registration.
Firestore: For storing and retrieving user data.

Image Details

Docker Hub Repository: https://hub.docker.com/r/nkem-slim/nkem-slim-playing-around-with-api
Image Name: nkem-slim/nkem-slim-playing-around-with-api:v1
Tags: v1

Build Instructions
To build the Docker image locally:
docker build -t nkem-slim/nkem-slim-playing-around-with-api:v1 .

This uses a multi-stage Dockerfile to compile the React application with Node.js and serve the static files with Nginx. The Firebase configuration is included in the source code.
Run Instructions
To run the application locally or on Web01/Web02:
docker pull nkem-slim/nkem-slim-playing-around-with-api:v1
docker run -d --name app --restart unless-stopped -p 8080:8080 nkem-slim/nkem-slim-playing-around-with-api:v1

Environment Variables:
Optional: PORT (default: 8080) to change the Nginx listening port, e.g., --env PORT=8080.
Firebase configuration is embedded in the application code.

Test locally by accessing http://localhost:8080 in a browser or using:
curl http://localhost:8080

Deployment Instructions
On Web01 and Web02

SSH into each server:ssh user@web-01
ssh user@web-02

Pull and run the Docker image:docker pull nkem-slim/nkem-slim-playing-around-with-api:v1
docker run -d --name app --restart unless-stopped -p 8080:8080 nkem-slim/nkem-slim-playing-around-with-api:v1

Verify each instance:curl http://web-01:8080
curl http://web-02:8080

Load Balancer Configuration (Lb01)

SSH into Lb01:ssh user@lb-01

Update /etc/haproxy/haproxy.cfg with the following backend configuration:backend webapps
balance roundrobin
server web01 172.30.0.11:8080 check
server web02 172.30.0.12:8080 check

Reload HAProxy to apply changes:docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'

Testing Steps & Evidence
To verify load balancing:

From your host, run:curl http://localhost

multiple times to confirm responses alternate between Web01 and Web02.
To distinguish servers, the application includes a server-specific identifier in the response (e.g., a custom header or message like “Served by Web01”).
Screenshots and logs are stored in the screenshots/ directory, showing:
Local app access (http://localhost:8080).
Load-balanced access with alternating responses.
Example: screenshots/traffic_balance.png, screenshots/test1.txt, screenshots/test2.txt.

Hardening

Firebase Credentials: Currently embedded in the source code. For production, consider using environment variables or a secrets management service (e.g., Docker secrets, AWS Secrets Manager) to avoid exposing credentials.
Input Validation: User inputs for authentication and Firestore operations are sanitized to prevent XSS attacks.
Recommendation: Implement Firebase Security Rules to restrict Firestore access to authenticated users and validate data.

Challenges Faced

Firebase Configuration: Hardcoding Firebase credentials simplified development but posed a security risk. For future iterations, environment variables will be used.
React Router: Nginx initially failed to handle client-side routing. Added try_files $uri $uri/ /index.html in nginx.conf to ensure proper routing.
Load Balancing Verification: Added server-specific identifiers to confirm round-robin balancing during testing.

Credits

Firebase: https://firebase.google.com/ for authentication and Firestore services.
React: https://reactjs.org/ for the frontend framework.
Nginx: https://nginx.org/ for serving the production build.
Docker: https://www.docker.com/ for containerization.
Lab Setup: https://github.com/waka-man/web_infra_lab for the deployment environment.
