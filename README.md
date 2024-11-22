<h1 align="center">Zoop Backend</h1>
<p align="center">A backend service for multi vendor food ordering application like zomato.</p>

## Note:
  - It is a small implementation of how __Zomato / Swiggy__ like services work internally.
  - The backend system design is done me, by just observing the __zomato__, and __swiggy__ applications, and applying __first principals__ to create a system similar to them.
  - I have tried to implement industry best practices to create the backend, implemented heavy caching for possible routes to reduce db queries, so that it can scale well.
  - This is currently an on-going project where __delivery service__, and __online payment service__ is yet to be implemented, and __frontend applications__ are pending.

## Architecture
 - It is a __Microservices__, and __event-driven__ based architecture (using redis pub/subs), where all requests of the client, is handled by specific microservices.
 - There is Main API Gateway which recieves all the request, and forward to desired microservice.
 - The main app handles all the WebSocket communication between client and server
 - The Internal communications is done via __redis pubs/subs__.
 - Below is a top-level system design:

![Screenshot from 2024-11-22 16-47-02](https://github.com/user-attachments/assets/c87ad5d0-c170-4a39-bac9-3980b2bc964c) 
   
## Tech Used: 
 - Monorepo (For managing multiple express applications)
 - ExpressJS (A Nodejs Backend Framework, to write Http/WebSocket servers)
 - PostgreSQL, Prisma (A SQL Database, for storing client data, And Prisma as ORM for writing SQL Queries)
 - TypeScript (For type-safety)
 - Zod (A validation Library, to validate request body on the server)
 - http-proxy-middleware (it forwards the requests to desired microservice)
 - WS Library (to accept websocket connections)
 - Redis (An in-memory db for caching, pub-subs, queues) - It is used for caching data, pub/subs for Internal backend communication between multiple internal services.

## How to Setup (Without Docker):

 - Step 1: Clone the repository:
      ```
      git clone https://github.com/vivek6201/zoop-backend-v2.git
      ```
 - Step 2: Install all dependencies:
      ```
      pnpm install
      ```
 - Step 3: copy the contents of .env.example file to .env file, of all the services, and replace the urls of your services
 - Step 4: Build all services, and then run all of them by writing the commands indivisually
      ```
      pnpm build && pnpm start
      ```
 - Step 4: Run your Redis Instance locally using docker, or get redis instance online
 
 - That's all.
