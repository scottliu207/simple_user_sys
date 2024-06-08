# Simple User Sys
This simple app side project allows user to sign in and view users dashboard, statistic. 

Sign up will send a verification email to the user, use the token provided in the email to send request to `/api/user/v1/email/verify`  to verify.

Users activities are stored in Redis, and backed up to MySQL by  scheduler, you can decide when it should run by change the env variable `SCHEDULE_SETTING`.

## Prerequest
- This app has wrap up into docker image, before using it, please make sure you've installed docker on your local environment.
- Creates a `.env` file on the root, and it must contains the followings:
```
DOMAIN={Server Domain}
EMAIL_REDIRECT= {Verification Email URI}
MYSQL_HOST=localhost
MYSQL_ACCOUNT=root
MYSQL_PASSWORD=root
MYSQL_PORT=3306
MYSQL_DATABASE=user_db
MYSQL_TIMEZONE=+00:00
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DB=0
REDIS_USER={Redis Account}
// leave it empty if you don't need it
REDIS_PASSWORD={Redis Password}
// leave it empty if you don't need it
ACCESS_TOKEN_EXPIRE=30m
REFRESH_TOKEN_EXPIRE=30d
EMAIL_TOKEN_EXPIRE=15m
EMAIL_MAX_TRY=5
SALT_ROUND=10
JWT_SECRET={Your Secret}
JWT_AUDIENCE=http://localhost:3000
JWT_ISSUER=http://localhost:3000/api
SENDGRID_API_KEY={Your SendGrid Secret}
SENDGRID_FROM={Your SendGrid Email Setting}
GOOGLE_CLIENT_ID={Your Google Client ID}
GOOGLE_CLIENT_SECRET={Your Google Client Secret}
GOOGLE_REDIRECT_URI={Your Google Redirect URI Setting}
SCHEDULE_SETTING=*/15 * * * *
```

## Basic
 
	./run.sh -u  
Runs up all necessary docker containers, it will start to pull MySQL, Redis and Simple User App images if it did not find any in your local environment.

	./run.sh -d
 Shuts down the docker containers

	./run.sh -b
Builds docker images from this current version.

	/.run.sh -h
Gets more info about this script.

## Current Feature
- Users
	- Allow users to sign up and verify by email.
	- Allows users to sign in with Basic-Auth and Google Oauth2.
	- Signs out and revoke user's credentials.
- User dashboard
	- Own profile 
		- Allows user to update their username and password.
	-	User list
		-	Retrieves user list with searching and pagenating.
	-	User statistic
		-	Shows total user sign up. 
		-	Shows total number of active users today.
		-	Shows average number of active users in the last seven days.

## Todo
- Recovery mech
- Log mech middleware