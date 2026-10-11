# Using guide

1. Install dependency with `npm install`
2. Make `.env` file in the root directory, which contains following:
```
BLOB_READ_WRITE_TOKEN=""
MONGODB_URI=""
BLOB_ID=""
JWT_SECRET=""
JWT_SECRET_URL=""
JWT_SECRET_TWOFA=""
URL = ""
RESEND=""
DISCORD=""
EMAIL=''
DISCORD_USER_ID=""
```
3. Run `npm run build` or `npm run build-webpack` (it depends on, your server supports Turbopack or not)
4. Run `npm run start`