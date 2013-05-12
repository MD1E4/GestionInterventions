<?php
	//if ( !defined("__ROOT__")) {
//    define('__ROOT__', dirname(dirname(__FILE__)));
//    }
	
	require_once("lib/dbcnx.php");
  
  function getMicroTime() { 
    // découpe le tableau de microsecondes selon les espaces     
    list($usec, $sec) = explode(" ",microtime());     
    // replace dans l'ordre     
    return ((float)$usec + (float)$sec); 
    }
    
  function getTempsEcoule($t1) {
  	  	return (getMicroTime() - $t1)*1000;
    }  
  
  function add_date($orgDate,$days){
	$cd = strtotime($orgDate);
	$retDAY = date('d-m-Y', time(0,0,0,date('m',$cd),date('d',$cd)+$days,date('Y',$cd)));
	return $retDAY;
	}

  function peoLog( $categorie, $msg) {
  	error_log( "[" . date("d/m/Y h:i:s", time()) . "] ".$categorie." : ".$msg."\r\n", 3, "logs/sql_trace.log" );
    }
	  
	  //if($error), $tmpExe, $error, $rows
//	  {
//		  $info = $rows . "lignes en " . $tempExe . "ms";
//	  }
//	  else
//	  {
//		  $info = "Erreur d'exécution de la requête";
//	  }
//	  
//  	error_log( "[" . date("d/m/Y h:i:s", time()) . " ; " . $info . " ] ".$categorie." : ".$msg.";\r\n", 3, "logs/sql_trace.log" );
//    }
	
  function getCurrentBDDdate() {
  	$db = peoDB::getInstance();
    $stmt = $db->query("SELECT TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS') AS CURDBTS FROM DUAL");
  	$g_dbts = null;
  	while($row = oci_fetch_assoc($stmt)) {
  	  $g_dbts = $row["CURDBTS"];	
  	  }
  	return $g_dbts;  
    }  

?>