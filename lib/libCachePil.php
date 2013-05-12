<?php
	//if ( !defined("__ROOT__")) {
//    define('__ROOT__', dirname(dirname(__FILE__)));
//    }

  include_once("lib/dbcnx.php");
  include_once("lib/peoDB.class.php");
    
  function getAllCache() 
  {
	  //Mise en cache des priorités
	  $dclPriorites = zend_disk_cache_fetch("PILOTCA::PRIORITES");
	  if ( $dclPriorites === false ) 
	  {
		  $v_peoDB = peoDB::getInstance();
		  $stmt = $v_peoDB->query( "SELECT rownum, p.* FROM (SELECT DISTINCT PRIORITE FROM T_PILOTAGE ORDER BY  SUBSTR(priorite, 2, 1)) p");

		  $Data = array();
		  while($row = oci_fetch_assoc($stmt))
		  {
			  $Data[count($Data)][0] = $row['ROWNUM'];
			  $Data[count($Data)-1][1] = utf8_encode($row['PRIORITE']);
		  }
		  $zzPut = zend_disk_cache_store('PILOTCA::PRIORITES', $Data, 36000);
		  oci_close( $stmt );
	  }
	  
	  
	  //Mise en cache des information sur la dernière récupération des données (nb ligne, date)
	  $dclBornes = zend_disk_cache_fetch("PILOTCA::BORNES");
	  if ($dclBornes === false) 
	  {
		  $v_peoDB = peoDB::getInstance();
		  $stmt = $v_peoDB->query( "SELECT COUNT(*) as NBENREG, TO_CHAR(MIN(DATE_CREATION_INTER), 'DD/MM/YYYY HH24:MI') as MINDATE, TO_CHAR(MAX(DERNIER_RAFRAICHISSEMENT), 'DD/MM/YYYY HH24:MI') as MAXDATE FROM T_PILOTAGE");
		  $Data = array();
		  while($row = oci_fetch_assoc($stmt))
		  {
			  $Data[count($Data)][0] = $row['NBENREG'];
			  $Data[count($Data)-1][1] = utf8_encode($row['MINDATE']);
			  $Data[count($Data)-1][2] = utf8_encode($row['MAXDATE']);
		  }
		  $zzPut = zend_disk_cache_store('PILOTCA::BORNES', $Data, 36000);
		  oci_close( $stmt );	
	  }
	  
	  
	  //Mise en cache des agences niveau 1
	  $dclAgencesN1 = zend_disk_cache_fetch("PILOTCA::AGENCESN1");
	  if ($dclAgencesN1 === false) 
	  {
		  $v_peoDB = peoDB::getInstance();
		  $stmt = $v_peoDB->query("SELECT rownum, a.* from (select DISTINCT p.NOM_AGENCE_NIV1 FROM T_PILOTAGE p join T_AGENTS a ON p.NOM_AGENCE_NIV1=a.NOM_AGENCE_NIV1 ORDER BY 1) a");
		  $Data = array();
		  while($row = oci_fetch_assoc($stmt))
		  {
			  $Data[count($Data)][0] = $row['ROWNUM'];
			  $Data[count($Data)-1][1] = utf8_encode($row['NOM_AGENCE_NIV1']);
		  }
		  $zzPut = zend_disk_cache_store('PILOTCA::AGENCESN1', $Data, 36000);
		  oci_close( $stmt );	
	  }
	  
	  
	  //Mise en cache des agences niveau 2
	  $dclAgencesN2 = zend_disk_cache_fetch("PILOTCA::AGENCESN2");
	  if ($dclAgencesN2 === false) 
	  {
		  $req = "SELECT ROWNUM, a.* FROM ((SELECT DISTINCT p.NOM_AGENCE_NIV2, p.NOM_AGENCE_NIV1 
			FROM t_agents p
			INTERSECT
			SELECT DISTINCT p.NOM_AGENCE_NIV2, p.NOM_AGENCE_NIV1 
			FROM t_pilotage p)
			UNION
			(SELECT DISTINCT p.NOM_AGENCE_NIV2, p.NOM_AGENCE_NIV1 
			FROM t_agents p)) a 
			ORDER BY 1";
		  
		  $v_peoDB = peoDB::getInstance();
		  $stmt = $v_peoDB->query($req);
		  $Data = array();
		  while($row = oci_fetch_assoc($stmt))
		  {
			  $Data[count($Data)][0] = $row['ROWNUM'];
			  $Data[count($Data)-1][1] = utf8_encode($row['NOM_AGENCE_NIV2']);
			  $Data[count($Data)-1][2] = utf8_encode($row['NOM_AGENCE_NIV1']);
		  }
		  $zzPut = zend_disk_cache_store('PILOTCA::AGENCESN2', $Data, 36000);
		  oci_close( $stmt );
	  }
  }  
?>  