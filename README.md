# RealNest - Real Estate Listing Platform

RealNest is a full-stack web application for managing real estate listings. Customers can publish properties and manage their dashboard while administrators moderate submissions and manage users. The backend is built with Spring Boot and secured with JWT; the frontend uses React with Vite.

## Tech Stack

- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate Validator, MySQL, Cloudinary SDK, SpringDoc
- Frontend: React 18, Vite, React Router 6, Formik, Yup, Axios, Bootstrap 5
- Auth: JWT with role-based access control (customer and admin)

## Features

### Customer
- Register and login with JWT authentication
- Create, edit, and delete property listings with Cloudinary image uploads
- Personal dashboard with approval status for each listing
- Search and filter properties by location, price range, type, and keywords
- View property detail pages with contact information

### Admin
- Auto-seeded admin account on startup (configurable)
- Approve or reject pending property listings
- View, update role, and delete users (cascades to their listings)
- API documentation available at /swagger-ui

## Project Structure

- backend/: Spring Boot service
- backend/src/main/java: Application source code
- frontend/: React (Vite) single-page app
- frontend/src/: Components, pages, context, and API helpers

## Backend Setup

1. Prerequisites
   - Java 17 or newer
   - Maven 3.9 or newer
   - MySQL 8 or newer
   - Cloudinary account (API keys)

2. Database
   - Create a schema (for example realnest)
   - Update credentials via environment variables or by editing backend/src/main/resources/application.properties

3. Recommended environment variables
   - DB_USERNAME=your_mysql_user
   - DB_PASSWORD=your_mysql_password
   - APP_JWT_SECRET=base64_encoded_32byte_key (generate with: openssl rand -base64 32)
   - APP_JWT_EXPIRATION=86400000
   - CLOUDINARY_CLOUD_NAME=your_cloud_name
   - CLOUDINARY_API_KEY=your_api_key
   - CLOUDINARY_API_SECRET=your_api_secret
   - APP_ADMIN_NAME=RealNest Admin
   - APP_ADMIN_EMAIL=admin@realnest.com
   - APP_ADMIN_PASSWORD=ChangeMe123!

4. Run the API
   - cd backend
   - mvn spring-boot:run

5. Useful endpoints
   - Swagger UI: http://localhost:8080/swagger-ui
   - OpenAPI JSON: http://localhost:8080/v3/api-docs
   - Health: http://localhost:8080/actuator/health

## Frontend Setup

1. Install dependencies
   - cd frontend
   - npm install

2. Configure API base URL
   - Create frontend/.env
   - Add VITE_API_URL=http://localhost:8080/api

3. Start the development server
   - npm run dev (Vite serves on http://localhost:3000)

## Usage Notes

- JWT tokens are stored in localStorage; Axios attaches them on each request.
- Property create/update uses multipart/form-data with a property JSON part and optional image part.
- The seeded admin user reads credentials from APP_ADMIN_* variables; change them before production.
- ROLE_CUSTOMER and ROLE_ADMIN are enforced via Spring method security.
- Search endpoint parameters: location, type, minPrice, maxPrice, keywords, page, size.

## Key API Endpoints

- POST /api/auth/register  Customer sign-up
- POST /api/auth/login  Authenticate and receive JWT
- GET /api/properties  Public, approved listings
- GET /api/properties/search  Public search with filters
- POST /api/properties  Create listing (customer)
- PUT /api/properties/{id}  Update listing (customer)
- DELETE /api/properties/{id}  Remove listing (customer)
- GET /api/properties/me  Authenticated user listings
- GET /api/admin/properties/pending  Pending approval queue
- POST /api/admin/properties/{id}/approve  Approve listing
- POST /api/admin/properties/{id}/reject  Reject listing
- GET /api/admin/users  Paginated users
- PUT /api/admin/users/{id}/role  Update role
- DELETE /api/admin/users/{id}  Delete user

## Testing Suggestions

- Use Spring Boot Test with Testcontainers for database-backed integration tests.
- Add React Testing Library with MSW to mock API calls on the frontend.

## Deployment Tips

- Replace default secrets and admin credentials before deploying.
- Update CorsConfig with production origins.
- Configure Cloudinary delivery options for responsive images.
- Host the backend (e.g., Render) and frontend (e.g., Netlify or Vercel) with matching environment variables.

## License

This project is provided as a template. Harden security and credentials before production use.
