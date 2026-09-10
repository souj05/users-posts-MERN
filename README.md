# Users-Posts (React, Node, Express, MongoDB)

The React version of my users-posts project. Same idea and same backend as the
Angular one: you sign up, log in, write posts with a picture, and edit or delete
your own posts.

```
users-posts/
├── backend/          Node + Express + MongoDB + multer
└── frontend/         React (Create React App)
```

## Built with

| Part | Tools |
| --- | --- |
| Frontend | React, React Router v6, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Login | JWT, bcrypt for the passwords |
| Images | multer, saved in `backend/images` |

## How to run it

You need Node and MongoDB (local or an Atlas cluster).

**1. Backend**

```
cd backend
npm install
cp .env.example .env
npm run dev
```

Fill in `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/users-posts
JWT_SECRET=some_long_random_string
```

**2. Frontend** (second terminal)

```
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000, backend on http://localhost:5000. If you
change the backend port, edit `frontend/src/config.js` too.

## API

| Method | Route | Needs token |
| --- | --- | --- |
| POST | `/api/user/signup` | no |
| POST | `/api/user/login` | no |
| GET | `/api/posts?pagesize=2&page=1` | no |
| GET | `/api/posts/:id` | no |
| POST | `/api/posts` | yes |
| PUT | `/api/posts/:id` | yes, only your own |
| DELETE | `/api/posts/:id` | yes, only your own |

Login returns `{ token, expiresIn, userId }`. The token lasts one hour.

## Frontend folders

They follow the old Angular project so the two are easy to compare:

```
frontend/src/
├── auth/
│   ├── auth.service.js    signup, login, token handling
│   ├── Login.js
│   └── Signup.js
├── posts/
│   ├── posts.service.js   the calls to /api/posts
│   ├── PostList.js        list + paginator
│   └── PostCreate.js      used for creating and editing
├── header/Header.js
├── App.js                 routes + who is logged in
├── App.css
└── config.js              backend url
```

| Angular | React |
| --- | --- |
| `auth.service.ts` (Subject) | `auth.service.js` + state in `App.js` |
| `auth.guard.ts` | a check on the `/create` and `/edit` routes |
| `auth-interceptor.ts` | the Authorization header in `posts.service.js` |
| `posts.service.ts` (Subject) | `posts.service.js`, posts kept in `PostList` state |
| `mat-paginator` | the small paginator at the bottom of `PostList.js` |

## Notes

- The token, its expiry date and the userId go in localStorage. The app logs out by
  itself when the hour is up.
- Edit and Delete only show on your own posts, and the backend checks it again, so
  it is not only hidden in the UI.
- A new post needs an image, `imagePath` is required in the Post model.
- The Mongo url and the JWT secret come from `.env`, which is gitignored. Do not put
  them back in `app.js`.
- On Heroku or Render the `images` folder gets wiped on every deploy, so switch to
  Cloudinary or S3 before deploying for real.
