# webspider-soundtrack

Nodejs webapp and webcrawler that reads http://download-soundtracks.com/dmca-policy/ and download in local the latest albuns uploaded.

https://webspider-soundtrack.herokuapp.com

## How to run
1. Install postgree and execute `$ createdb webspider-soundtrack`
2. Create a db user 
```
psql
CREATE ROLE postgres WITH LOGIN PASSWORD '';
ALTER ROLE me CREATEDB;
```
3. clone `$ git clone https://github.com/altherlex/webspider-soundtrack.git`
4. `$ cd webspider-soundtrack`
5. `$ touch .env`
6. Set `.env` file
```
DATABASE_URL=postgres://user:password@127.0.0.1:5432/webspider-soundtrack
LOGIN_USER=email@email.com
LOGIN_PASS=password
```
7. run `$ node init_db createTables`
8. run `$ node init_db addColumns`
9. `$ npm start` check http://localhost:3000

## Docker

```
$ git clone https://github.com/altherlex/webspider-soundtrack.git
$ cd webspider-soundtrack
$ docker-compose up
$ docker exec -it webspider-soundtrack_postgres_1 psql -U postgres -c "create database webspidersoundtrack"
$ docker exec -it webspider-soundtrack_app_1 node /usr/src/app/init_db createTables
$ docker exec -it webspider-soundtrack_app_1 node /usr/src/app/init_db addColumns
```

* Access on http://localhost:5000

## TODO

1. Implement ORM: [Sequelize](https://sequelize.org/)
2. Download and make available somewhere on the cloud.
3. Heroku has problem running `puppeteer`
