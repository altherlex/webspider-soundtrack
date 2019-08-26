const allowedColumn = ['id', 'name', 'post_url', 'capa', 'hotlink_url', 'download_url', 'created_date', 'modified_date', 'final_url_generated', 'downloaded', 'path']
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const restfulFilter = require('restful-filter');
const filter = restfulFilter();
const jsonSql = require('json-sql')({dialect:'postgresql', namedValues:false});
const qs = require('qs');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const objQuery = {
      type: 'select',
      table: 'albums',
      sort: {created_date: -1}
    }; 
    // DOC: paginate
    const paginationParams = filter.parse(req.query).paginate;
    console.log('paginationParams: ', paginationParams);

    if (req.query.all===undefined){
      objQuery.limit = paginationParams.limit;
      objQuery.offset = paginationParams.offset;
    }

    // DOC: condition
    const searchParams = filter.parse(req.query, allowedColumn).filter;
    console.log('searchParams:', searchParams );

    if (searchParams){
      objQuery.condition = searchParams.map(obj => {
        const rObj = {};
        const c = {};
        c[obj.operator] = obj.value;
        rObj[obj.column] = c;
        return rObj;
      });
    }

    if (req.query.fields) {
      const select = qs.parse('fields='+req.query.fields, { comma: true });
      console.log('select: ', select);
      const fields = select.fields.filter(col => allowedColumn.includes(col) );
      if (fields.lenght!=0)
        objQuery.fields = fields;
    }

    const sql = jsonSql.build(objQuery);
    console.log('SQL query: ', sql.query);
    console.log('SQL values: ', sql.values);
    const { rows, rowCount } = await pool.query(sql.query, sql.values);

    const result = { 
      page: (~~(req.query.page) || 1),
      all: !(req.query.all===undefined),
      condition: objQuery.condition,
      total: rowCount, 
      rows
    };

    if (req.query.format==='json')
      return res.status(200).json(result);
    else
      return res.status(200).render('index', { rows, rowCount });

  } catch(error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

module.exports = router;
