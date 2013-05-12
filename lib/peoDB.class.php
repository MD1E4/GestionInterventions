<?php
	//if ( !defined("__ROOT__")) {
//    define('__ROOT__', dirname(dirname(__FILE__)));
//    }

  include_once("consult_intervention/lib/dbcnx.php");
  include_once ("consult_intervention/lib/libpeosd.php");
  
  
  class peoDB {
    private $_db;
    static $_instance;
    const USERBDD = "root";
	const MDPBDD = "azerty";
	const URLBDD = "mysql:dbname=world2;host=127.0.0.1";
	//const URLBDD = 'localhost:1526/XE';
	
    
    private function __construct() {
      $this->_db = oci_pconnect( peoDB::USERBDD, peoDB::MDPBDD, peoDB::URLBDD ); //, "CHARSET"
      if ( ! $this->_db ) {
      	$msgDBerror = oci_error();
        }
      else {
        $s = oci_parse( $this->_db, "alter session set nls_date_format='DD/MM/YYYY HH24:MI'");
        oci_free_statement($s);
        }
      }
      
  //private __clone() {};
  public static function getInstance() {
    if( ! (self::$_instance instanceof self) ) {
      self::$_instance = new self();
      }
    return self::$_instance;
    }

    
  public function query($sql) {
  	
  	$s = oci_parse($this->_db,$sql);
  	
	$t1 = getMicroTime();
	$error = oci_execute($s);
	//$tmp = getTempsEcoule($t1);
	//$rows = count($s);
	peoLog( "SQL", $sql);//, $tmp, $error, $rows
    return $s;
  }
}
  
?>  