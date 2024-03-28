<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class lumise_database{

     /**
     * Table prefix
     * @var string
     */
    public $prefix = '';

    /**
     * Static instance of self
     *
     * @var lumise_database
     */
    protected static $_instance;

    /**
     * The SQL query to be prepared and executed
     * @var string
     */
    protected $_query;

    /**
     * The previously executed SQL query
     * @var string
     */
    protected $_lastQuery;

    /**
     * The SQL query options required after SELECT, INSERT, UPDATE or DELETE
     * @var string
     */
    protected $_queryOptions = array();

    /**
     * An array that holds where joins
     * @var array
     */
    protected $_join = array();

    /**
     * An array that holds where conditions
     * @var array
     */
    protected $_where = array();

    /**
     * An array that holds where join ands
     *
     * @var array
     */
    protected $_joinAnd = array();

    /**
     * An array that holds having conditions
     * @var array
     */
    protected $_having = array();

    /**
     * Dynamic type list for order by condition value
     * @var array
     */
    protected $_orderBy = array();

    /**
     * Dynamic type list for group by condition value
     * @var array
     */
    protected $_groupBy = array();

    /**
     * Variable which holds an amount of returned rows during get/getOne/select queries
     * @var string
     */
    public $count = 0;
    
    /**
     * Variable which holds an amount of returned rows during get/getOne/select queries with withTotalCount()
     * @var string
     */
    public $totalCount = 0;

    public function __construct($prefix = null) {

        if (isset($prefix)) {
            $this->setPrefix($prefix);
        }

        self::$_instance = $this;
    }   
    /**
     * Execute raw SQL query.
     *
     * @param string $query      User-provided query to execute.
     * @param array  $bindParams Variables array to bind to the SQL statement.
     *
     * @return array Contains the returned rows from the query.
     */
    public function rawQuery($query, $bindParams = null){
        global $wpdb;
        
        $this->_lastQuery = $query;

        if (is_array($bindParams) === true) {
            $this->_lastQuery = $wpdb->prepare( $this->_lastQuery , $bindParams);
        }
        
        $results = $wpdb->get_results($this->_lastQuery, ARRAY_A );

        $this->reset();

        return $results;
    }

    /**
     * Helper function to execute raw SQL query and return only 1 row of results.
     * Note that function do not add 'limit 1' to the query by itself
     * Same idea as getOne()
     *
     * @param string $query      User-provided query to execute.
     * @param array  $bindParams Variables array to bind to the SQL statement.
     *
     * @return array|null Contains the returned row from the query.
     */
    public function rawQueryOne($query, $bindParams = null){
        $res = $this->rawQuery($query, $bindParams);
        if (is_array($res) && isset($res[0])) {
            return $res[0];
        }

        return null;
    }
    /**
     * Insert method to add new row
     *
     * @param string $tableName The name of the table.
     * @param array $insertData Data containing information for inserting into the DB.
     *
     * @return bool Boolean indicating whether the insert query was completed succesfully.
     */
    public function insert($tableName, $insertData, $format = null)
    {
        global $wpdb;

        $results = $wpdb->insert( $this->prefix.$tableName, $insertData, $format = null);

        if ( is_wp_error( $results ) ) {
            return false;
        }
        return $wpdb->insert_id;
    }

    /**
     * Update query. Be sure to first call the "where" method.
     *
     * @param string $tableName The name of the database table to work with.
     * @param array  $tableData Array of data to update the desired row.
     * @param int    $numRows   Limit on the number of rows that can be updated.
     *
     * @return bool
     */
    public function update($tableName, $tableData, $numRows = null){
        global $wpdb;

        $this->_query = "UPDATE " . $this->prefix . $tableName;

        $this->_buildQuery($numRows, $tableData);

        $results = $wpdb->query($this->_lastQuery);
	    
        $this->reset();

        return $results;
    }

    /**
     * Delete query. Call the "where" method first.
     *
     * @param string  $tableName The name of the database table to work with.
     * @param int|array $numRows Array to define SQL limit in format Array ($count, $offset)
     *                               or only $count
     *
     * @return bool Indicates success. 0 or 1.
     */
    public function delete($tableName, $numRows = null){
        global $wpdb;

        $table = $this->prefix . $tableName;

        if (count($this->_join)) {
            $this->_query = "DELETE " . preg_replace('/.* (.*)/', '$1', $table) . " FROM " . $table;
        } else {
            $this->_query = "DELETE FROM " . $table;
        }

        $this->_buildQuery($numRows);

        $results = $wpdb->query($this->_lastQuery);
	    
        $this->reset();

        return $results;
    }

    /**
     * A convenient SELECT * function to get one record.
     *
     * @param string  $tableName The name of the database table to work with.
     * @param string  $columns Desired columns
     *
     * @return array Contains the returned rows from the select query.
     */
    public function getOne($tableName, $columns = '*')
    {
        $res = $this->get($tableName, 1, $columns);

        if ($res instanceof lumise_database) {
            return $res;
        } elseif (is_array($res) && isset($res[0])) {
            return $res[0];
        } elseif ($res) {
            return $res;
        }

        return null;
    }

    /**
     * This method allows you to specify multiple (method chaining optional) AND WHERE statements for SQL queries.
     *
     * @param string $whereProp  The name of the database field.
     * @param mixed  $whereValue The value of the database field.
     * @param string $operator Comparison operator. Default is =
     * @param string $cond Condition of where statement (OR, AND)
     *
     */
    public function where($whereProp, $whereValue = 'DBNULL', $operator = '=', $cond = 'AND'){
        // forkaround for an old operation api
        if (is_array($whereValue) && ($key = key($whereValue)) != "0") {
            $operator = $key;
            $whereValue = $whereValue[$key];
        }

        if (count($this->_where) == 0) {
            $cond = '';
        }

        $this->_where[] = array($cond, $whereProp, $operator, $whereValue);

        return $this;
    }

    /**
     * This method allows you to concatenate joins for the final SQL statement.
     *
     * @uses $MySqliDb->join('table1', 'field1 <> field2', 'LEFT')
     *
     * @param string $joinTable The name of the table.
     * @param string $joinCondition the condition.
     * @param string $joinType 'LEFT', 'INNER' etc.
     *
     * @throws Exception
     */
    public function join($joinTable, $joinCondition, $joinType = '')
    {
        $allowedTypes = array('LEFT', 'RIGHT', 'OUTER', 'INNER', 'LEFT OUTER', 'RIGHT OUTER');
        $joinType = strtoupper(trim($joinType));

        if ($joinType && !in_array($joinType, $allowedTypes)) {
            throw new Exception('Wrong JOIN type: ' . $joinType);
        }

        if (!is_object($joinTable)) {
            $joinTable = $this->prefix . $joinTable;
        }

        $this->_join[] = Array($joinType, $joinTable, $joinCondition);

        return $this;
    }

    /**
     * This method allows you to specify multiple (method chaining optional) ORDER BY statements for SQL queries.
     *
     * @param string $orderByField The name of the database field.
     * @param string $orderByDirection Order direction.
     * @param array $customFields Fieldset for ORDER BY FIELD() ordering
     *
     * @throws Exception
     */
    public function orderBy($orderByField, $orderbyDirection = "DESC", $customFields = null)
    {
        $allowedDirection = Array("ASC", "DESC");
        $orderbyDirection = strtoupper(trim($orderbyDirection));
        $orderByField = preg_replace("/[^-a-z0-9\.\(\),_`\*\'\"]+/i", '', $orderByField);

        // Add table prefix to orderByField if needed.
        //FIXME: We are adding prefix only if table is enclosed into `` to distinguish aliases
        // from table names
        $orderByField = preg_replace('/(\`)([`a-zA-Z0-9_]*\.)/', '\1' . $this->prefix . '\2', $orderByField);


        if (empty($orderbyDirection) || !in_array($orderbyDirection, $allowedDirection)) {
            throw new Exception('Wrong order direction: ' . $orderbyDirection);
        }

        if (is_array($customFields)) {
            foreach ($customFields as $key => $value) {
                $customFields[$key] = preg_replace("/[^-a-z0-9\.\(\),_` ]+/i", '', $value);
            }

            $orderByField = 'FIELD (' . $orderByField . ', "' . implode('","', $customFields) . '")';
        }

        $this->_orderBy[$orderByField] = $orderbyDirection;
        return $this;
    }

    /**
     * A convenient SELECT * function.
     *
     * @param string  $tableName The name of the database table to work with.
     * @param int|array $numRows Array to define SQL limit in format Array ($count, $offset)
     *                               or only $count
     * @param string $columns Desired columns
     *
     * @return array Contains the returned rows from the select query.
     */
    public function get($tableName, $numRows = null, $columns = '*')
    {   
        global $wpdb;

        if (empty($columns)) {
            $columns = '*';
        }
        
        $column = is_array($columns) ? implode(', ', $columns) : $columns;

        if (strpos($tableName, '.') === false) {
            $this->_tableName = $this->prefix . $tableName;
        } else {
            $this->_tableName = $tableName;
        }

        $this->_query = 'SELECT ' . implode(' ', $this->_queryOptions) . ' ' .
            $column . " FROM " . $this->_tableName;
        
        $this->_buildQuery($numRows);
        
        $results = $wpdb->get_results($this->_lastQuery, ARRAY_A);
	    
        if (in_array('SQL_CALC_FOUND_ROWS', $this->_queryOptions)) {
            $stmt = $wpdb->get_results('SELECT FOUND_ROWS()', ARRAY_A);
            $this->totalCount = $stmt[0]['FOUND_ROWS()'];
        }
        
        $this->reset();

        return $results;
    }
    
    /**
     * Abstraction method that will compile the WHERE statement,
     * any passed update data, and the desired rows.
     * It then builds the SQL query.
     *
     * @param int|array $numRows Array to define SQL limit in format Array ($count, $offset)
     *                               or only $count
     * @param array $tableData Should contain an array of data for updating the database.
     *
     * @return mysqli_stmt Returns the $stmt object.
     */
    protected function _buildQuery($numRows = null, $tableData = null){
        
        global $lumise;
	    
        $this->_buildJoin();
        $this->_buildInsertQuery($tableData);
        $this->_buildCondition('WHERE', $this->_where);
        $this->_buildGroupBy();
        $this->_buildCondition('HAVING', $this->_having);
        $this->_buildOrderBy();
        $this->_buildLimit($numRows);
        $this->_buildOnDuplicate($tableData);

        if ($this->_forUpdate) {
            $this->_query .= ' FOR UPDATE';
        }
        if ($this->_lockInShareMode) {
            $this->_query .= ' LOCK IN SHARE MODE';
        }
		
        $this->_lastQuery = $this->replacePlaceHolders($this->_query, $this->_bindParams);
	    
	    $this->_lastQuery = $lumise->apply_filters('last_query', $this->_lastQuery);


    }

    /**
     * Function to replace ? with variables from bind variable
     *
     * @param string $str
     * @param array $vals
     *
     * @return string
     */
    protected function replacePlaceHolders($str, $vals)
    {
        $i = 1;
        $newStr = "";

        if (empty($vals)) {
            return $str;
        }

        while ($pos = strpos($str, "?")) {
            $val = $vals[$i++];
            if (is_object($val)) {
                $val = '[object]';
            }
            if ($val === null) {
                $val = 'NULL';
            }
            $newStr .= substr($str, 0, $pos) . "'" . $val . "'";
            $str = substr($str, $pos + 1);
        }
        $newStr .= $str;
        return $newStr;
    }

    /**
     * Method returns last executed query
     *
     * @return string
     */
    public function getLastQuery()
    {
        return $this->_lastQuery;
    }

    /**
     * This method allows you to specify multiple (method chaining optional) options for SQL queries.
     *
     *
     * @param string|array $options The optons name of the query.
     *
     * @throws Exception
     */
    public function setQueryOption($options)
    {
        $allowedOptions = Array('ALL', 'DISTINCT', 'DISTINCTROW', 'HIGH_PRIORITY', 'STRAIGHT_JOIN', 'SQL_SMALL_RESULT',
            'SQL_BIG_RESULT', 'SQL_BUFFER_RESULT', 'SQL_CACHE', 'SQL_NO_CACHE', 'SQL_CALC_FOUND_ROWS',
            'LOW_PRIORITY', 'IGNORE', 'QUICK', 'MYSQLI_NESTJOIN', 'FOR UPDATE', 'LOCK IN SHARE MODE');

        if (!is_array($options)) {
            $options = Array($options);
        }

        foreach ($options as $option) {
            $option = strtoupper($option);
            if (!in_array($option, $allowedOptions)) {
                throw new Exception('Wrong query option: ' . $option);
            }

            if ($option == 'MYSQLI_NESTJOIN') {
                $this->_nestJoin = true;
            } elseif ($option == 'FOR UPDATE') {
                $this->_forUpdate = true;
            } elseif ($option == 'LOCK IN SHARE MODE') {
                $this->_lockInShareMode = true;
            } else {
                $this->_queryOptions[] = $option;
            }
        }

        return $this;
    }

    /**
     * Abstraction method that will build an JOIN part of the query
     */
    protected function _buildJoin () {
        if (empty ($this->_join))
            return;

        foreach ($this->_join as $data) {
            list ($joinType,  $joinTable, $joinCondition) = $data;

            if (is_object ($joinTable))
                $joinStr = $this->_buildPair ("", $joinTable);
            else
                $joinStr = $joinTable;

            $this->_query .= " " . $joinType. " JOIN " . $joinStr ." on " . $joinCondition;

            // Add join and query
            if (!empty($this->_joinAnd) && isset($this->_joinAnd[$joinStr])) {
                foreach($this->_joinAnd[$joinStr] as $join_and_cond) {
                    list ($concat, $varName, $operator, $val) = $join_and_cond;
                    $this->_query .= " " . $concat ." " . $varName;
                    $this->conditionToSql($operator, $val);
                }
            }
        }
    }

    /**
     * Convert a condition and value into the sql string
     * @param  String $operator The where constraint operator
     * @param  String $val    The where constraint value
     */
    private function conditionToSql($operator, $val) {
        switch (strtolower ($operator)) {
            case 'not in':
            case 'in':
                $comparison = ' ' . $operator. ' (';
                if (is_object ($val)) {
                    $comparison .= $this->_buildPair ("", $val);
                } else {
                    foreach ($val as $v) {
                        $comparison .= ' ?,';
                        $this->_bindParam ($v);
                    }
                }
                $this->_query .= rtrim($comparison, ',').' ) ';
                break;
            case 'not between':
            case 'between':
                $this->_query .= " $operator ? AND ? ";
                $this->_bindParams ($val);
                break;
            case 'not exists':
            case 'exists':
                $this->_query.= $operator . $this->_buildPair ("", $val);
                break;
            default:
                if (is_array ($val))
                    $this->_bindParams ($val);
                else if ($val === null)
                    $this->_query .= $operator . " NULL";
                else if ($val != 'DBNULL' || $val == '0')
                    $this->_query .= $this->_buildPair ($operator, $val);
        }
    }

    /**
     * Abstraction method that will build the part of the WHERE conditions
     *
     * @param string $operator
     * @param array $conditions
     */
    protected function _buildCondition($operator, &$conditions)
    {
        if (empty($conditions)) {
            return;
        }

        //Prepare the where portion of the query
        $this->_query .= ' ' . $operator;

        foreach ($conditions as $cond) {
            list ($concat, $varName, $operator, $val) = $cond;
            $this->_query .= " " . $concat . " " . $varName;

            switch (strtolower($operator)) {
                case 'not in':
                case 'in':
                    $comparison = ' ' . $operator . ' (';
                    if (is_object($val)) {
                        $comparison .= $this->_buildPair("", $val);
                    } else {
                        foreach ($val as $v) {
                            $comparison .= ' ?,';
                            $this->_bindParam($v);
                        }
                    }
                    $this->_query .= rtrim($comparison, ',') . ' ) ';
                    break;
                case 'not between':
                case 'between':
                    $this->_query .= " $operator ? AND ? ";
                    $this->_bindParams($val);
                    break;
                case 'not exists':
                case 'exists':
                    $this->_query.= $operator . $this->_buildPair("", $val);
                    break;
                default:
                    if (is_array($val)) {
                        $this->_bindParams($val);
                    } elseif ($val === null) {
                        $this->_query .= ' ' . $operator . " NULL";
                    } elseif ($val != 'DBNULL' || $val == '0') {
                        $this->_query .= $this->_buildPair($operator, $val);
                    }
            }
        }
    }

    /**
     * Abstraction method that will build an INSERT or UPDATE part of the query
     *
     * @param array $tableData
     */
    protected function _buildInsertQuery($tableData)
    {
        if (!is_array($tableData)) {
            return;
        }

        $isInsert = preg_match('/^[INSERT|REPLACE]/', $this->_query);
        $dataColumns = array_keys($tableData);
        if ($isInsert) {
            if (isset ($dataColumns[0]) && !is_array($dataColumns[0]))
               $this->_query .= ' (`' . implode( '`, `', $dataColumns ) . '`) ';
            $this->_query .= ' VALUES (';
        } else {
            $this->_query .= " SET ";
        }

        $this->_buildDataPairs($tableData, $dataColumns, $isInsert);

        if ($isInsert) {
            $this->_query .= ')';
        }
    }

    /**
     * Abstraction method that will build the GROUP BY part of the WHERE statement
     *
     * @return void
     */
    protected function _buildGroupBy()
    {
        if (empty($this->_groupBy)) {
            return;
        }

        $this->_query .= " GROUP BY ";

        foreach ($this->_groupBy as $key => $value) {
            $this->_query .= $value . ", ";
        }

        $this->_query = rtrim($this->_query, ', ') . " ";
    }

    /**
     * Abstraction method that will build the LIMIT part of the WHERE statement
     *
     * @return void
     */
    protected function _buildOrderBy()
    {
        if (empty($this->_orderBy)) {
            return;
        }

        $this->_query .= " ORDER BY ";
        foreach ($this->_orderBy as $prop => $value) {
            if (strtolower(str_replace(" ", "", $prop)) == 'rand()') {
                $this->_query .= "rand(), ";
            } else {
                $this->_query .= $prop . " " . $value . ", ";
            }
        }

        $this->_query = rtrim($this->_query, ', ') . " ";
    }

    /**
     * Abstraction method that will build the LIMIT part of the WHERE statement
     *
     * @param int|array $numRows Array to define SQL limit in format Array ($count, $offset)
     *                               or only $count
     *
     * @return void
     */
    protected function _buildLimit($numRows)
    {
        if (!isset($numRows)) {
            return;
        }

        if (is_array($numRows)) {
            $this->_query .= ' LIMIT ' . (int) $numRows[0] . ', ' . (int) $numRows[1];
        } else {
            $this->_query .= ' LIMIT ' . (int) $numRows;
        }
    }
    /**
     * Insert/Update query helper
     *
     * @param array $tableData
     * @param array $tableColumns
     * @param bool $isInsert INSERT operation flag
     *
     * @throws Exception
     */
    public function _buildDataPairs($tableData, $tableColumns, $isInsert)
    {
        foreach ($tableColumns as $column) {
            $value = $tableData[$column];

            if (!$isInsert) {
                if(strpos($column,'.')===false) {
                    $this->_query .= "`" . $column . "` = ";
                } else {
                    $this->_query .= str_replace('.','.`',$column) . "` = ";
                }
            }

            // Subquery value
            if ($value instanceof lumise_database) {
                $this->_query .= $this->_buildPair("", $value) . ", ";
                continue;
            }

            // Simple value
            if (!is_array($value)) {
                $this->_bindParam($value);
                $this->_query .= '?, ';
                continue;
            }

            // Function value
            $key = key($value);
            $val = $value[$key];
            switch ($key) {
                case '[I]':
                    $this->_query .= $column . $val . ", ";
                    break;
                case '[F]':
                    $this->_query .= $val[0] . ", ";
                    if (!empty($val[1])) {
                        $this->_bindParams($val[1]);
                    }
                    break;
                case '[N]':
                    if ($val == null) {
                        $this->_query .= "!" . $column . ", ";
                    } else {
                        $this->_query .= "!" . $val . ", ";
                    }
                    break;
                default:
                    throw new Exception("Wrong operation");
            }
        }
        $this->_query = rtrim($this->_query, ', ');
    }
    /**
     * Helper function to add variables into the query statement
     *
     * @param array $tableData Variable with values
     */
    protected function _buildOnDuplicate($tableData)
    {
        if (is_array($this->_updateColumns) && !empty($this->_updateColumns)) {
            $this->_query .= " ON DUPLICATE KEY UPDATE ";
            if ($this->_lastInsertId) {
                $this->_query .= $this->_lastInsertId . "=LAST_INSERT_ID (" . $this->_lastInsertId . "), ";
            }

            foreach ($this->_updateColumns as $key => $val) {
                // skip all params without a value
                if (is_numeric($key)) {
                    $this->_updateColumns[$val] = '';
                    unset($this->_updateColumns[$key]);
                } else {
                    $tableData[$key] = $val;
                }
            }
            $this->_buildDataPairs($tableData, array_keys($this->_updateColumns), false);
        }
    }

    /**
     * This method is needed for prepared statements. They require
     * the data type of the field to be bound with "i" s", etc.
     * This function takes the input, determines what type it is,
     * and then updates the param_type.
     *
     * @param mixed $item Input to determine the type.
     *
     * @return string The joined parameter types.
     */
    protected function _determineType($item)
    {
        switch (gettype($item)) {
            case 'NULL':
            case 'string':
                return 's';
                break;

            case 'boolean':
            case 'integer':
                return 'i';
                break;

            case 'blob':
                return 'b';
                break;

            case 'double':
                return 'd';
                break;
        }
        return '';
    }

    /**
     * Helper function to add variables into bind parameters array
     *
     * @param string Variable value
     */
    protected function _bindParam($value)
    {
        $this->_bindParams[0] .= $this->_determineType($value);
        array_push($this->_bindParams, $value);
    }

    /**
     * Helper function to add variables into bind parameters array in bulk
     *
     * @param array $values Variable with values
     */
    protected function _bindParams($values)
    {
        foreach ($values as $value) {
            $this->_bindParam($value);
        }
    }

    /**
     * Helper function to add variables into bind parameters array and will return
     * its SQL part of the query according to operator in ' $operator ?' or
     * ' $operator ($subquery) ' formats
     *
     * @param string $operator
     * @param mixed $value Variable with values
     *
     * @return string
     */
    protected function _buildPair($operator, $value)
    {
        if (!is_object($value)) {
            $this->_bindParam($value);
            return ' ' . $operator . ' ? ';
        }

        $subQuery = $value->getSubQuery();
        $this->_bindParams($subQuery['params']);

        return " " . $operator . " (" . $subQuery['query'] . ") " . $subQuery['alias'];
    }

    /**
     * Function to enable SQL_CALC_FOUND_ROWS in the get queries
     *
     */
    public function withTotalCount()
    {
        $this->setQueryOption('SQL_CALC_FOUND_ROWS');
        return $this;
    }

    /**
     * Reset states after an execution
     *
     */
    protected function reset()
    {
        $this->_where = array();
        $this->_having = array();
        $this->_join = array();
        $this->_joinAnd = array();
        $this->_orderBy = array();
        $this->_groupBy = array();
        $this->_bindParams = array(''); // Create the empty 0 index
        $this->_query = null;
        $this->_queryOptions = array();
        $this->returnType = 'array';
        $this->_nestJoin = false;
        $this->_forUpdate = false;
        $this->_lockInShareMode = false;
        $this->_tableName = '';
        $this->_lastInsertId = null;
        $this->_updateColumns = null;
        $this->_mapKey = null;
    }
    
    /**
     * Method to set a prefix
     *
     * @param string $prefix Contains a table prefix
     *
     */
    public function setPrefix($prefix = '')
    {
        $this->prefix = $prefix;
        return $this;
    }

    /**
     * A method of returning the static instance to allow access to the
     * instantiated object from within another class.
     * Inheriting this class would require reloading connection info.
     *
     */
    public static function getInstance()
    {
        return self::$_instance;
    }
}
