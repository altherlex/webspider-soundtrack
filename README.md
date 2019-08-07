# webspider-soundtrack

## How to run
1. Install postgree and execute `createdb webspider-soundtrack`
2. Create a db user 
```
psql
CREATE ROLE postgres WITH LOGIN PASSWORD '';
ALTER ROLE me CREATEDB;
```
3. clone `git clone https://github.com/altherlex/webspider-soundtrack.git`
4. `cd webspider-soundtrack`
5. `touch .env`
6. Set `.env` file
```
DATABASE_URL=postgres://user:password@127.0.0.1:5432/webspider-soundtrack
LOGIN_USER=email@email.com
LOGIN_PASS=password
```
7. run `node init_db createTables`
8. run `node init_db addColumns`
9. `npm start` check http://localhost:3000

