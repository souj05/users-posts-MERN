# Users Posts

A small posting app. You make an account, write a post with a picture, and edit or
delete the ones you wrote. Anyone can read the feed without signing up.

React on the front, Node/Express/MongoDB on the back. Login is JWT based and images
are uploaded with multer.

## Stack

- React (Create React App), React Router
- Node.js, Express
- MongoDB Atlas with Mongoose
- JWT for login, bcrypt for the passwords
- multer for the image uploads

## Running it

You need Node and a MongoDB connection string.

```
cd backend
npm install
```

Make a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:3000
COOKIE_SECURE=false
```

`CLIENT_URL` has to be the exact address the React app runs on. Cookies are not sent
to a wildcard origin, so this cannot be `*`. Set `COOKIE_SECURE=true` only once the
site is on https.

If you use Atlas, put the database name in the connection string before the `?`,
like `...mongodb.net/users-posts?appName=Cluster0`. Leave it out and every query
fails with an authorization error.

```
npm run dev
```

Frontend, in a second terminal:

```
cd frontend
npm install
npm start
```

Backend runs on 5000, frontend on 3000.

## How the auth works

Logging in signs a JWT holding the user id and puts it in an httpOnly cookie. The
browser sends it automatically on every request; javascript on the page cannot read
it, so a script that gets injected into the site cannot steal the session.

Because the app cannot read the cookie either, it asks `/api/user/me` on load to
find out who is logged in.

The post's `creator` never comes from the browser. It comes off the verified token:

```js
creator: req.userData.userId
```

If the frontend sent it, anyone could type someone else's id and post as them.

Editing and deleting match on both the post id and the creator, so a request for
someone else's post matches nothing and returns 403:

```js
Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
```

The Edit and Delete buttons are hidden in the UI too, but that part is only
cosmetic. Hiding a button stops nobody who can open devtools.

Tokens last an hour. The app sets a timer on login and logs you out when it expires
rather than waiting for a request to fail.

Login and signup are rate limited to 10 attempts per IP every 15 minutes.
