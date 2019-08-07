# webspider-soundtrack

## How to run
1. Install postgree and execute `createdb webspider-soundtrack`
2. Create a db user 
```
psql
CREATE ROLE postgres WITH LOGIN PASSWORD '';
ALTER ROLE me CREATEDB;
```
3. clone `git clone https://github.com/olalonde/pgtools.git`
4. run `node init_db createTables

