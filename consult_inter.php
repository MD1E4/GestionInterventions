<?php
include_once("lib/dbcnx.php");

session_start();

$_SESSION['code_user']="";

if(isset($_GET['connect']))
{
	$idUser = $_POST['idUser'];
	$pwdUser = $_POST['pwdUser'];

	$_SESSION['code_user'] = $idUser;

	$req ="select Nom, Prenom, Groupe, Id_agence_niv2, Id_agence_niv1
	from T_AGENTS
	WHERE code_agent = '".$idUser.
	"' AND mdp_agt = '".$pwdUser."'";

	$query = $cnxBdd->prepare($req);
	$query->execute();
	$res = $query->fetchAll(PDO::FETCH_ASSOC);

	header('Content-Type: application/json;');
	echo json_encode($res);
}

if(isset($_GET["loadagence1"]))
{
	$req = "SELECT id, nom_agence1
	FROM T_AGENCE1";

	$query = $cnxBdd->prepare($req);
	$query->execute();
	$res = $query->fetchAll(PDO::FETCH_ASSOC);

	for($i = 0; $i < count($res) ; $i++)
	{
		$res[$i]['nom_agence1'] = utf8_encode($res[$i]['nom_agence1']);
	}

	header('Content-Type: application/json;');
	echo json_encode($res);
}

if(isset($_GET['loadagence2']))
{
	$agence1 = $_POST['di_rtsp'];

	$req = 'SELECT id, nom_agence2
	FROM T_AGENCE2
	WHERE id_agence_niv1 = '.$agence1;
	
	$query = $cnxBdd->prepare($req);
	$query->execute();
	$res = $query->fetchAll(PDO::FETCH_ASSOC);

	for($i = 0; $i < count($res) ; $i++)
	{
		$res[$i]['nom_agence2'] = utf8_encode($res[$i]['nom_agence2']);
	}

	header('Content-Type: application/json;');
	echo json_encode($res);
}

if(isset($_GET['loadpriorite']))
{
	$req = 'SELECT Id, Libelle
	FROM T_PRIORITE
	ORDER BY 1';

	$query = $cnxBdd->prepare($req);
	$query->execute();
	$res = $query->fetchAll(PDO::FETCH_ASSOC);

	header('Content-Type: application/json;');
	echo json_encode($res);
}

$array = array();

//Charge le cache au chargement si ce dernier n'est pas chargé
if(isset($_GET['cache']))
{
	getAllCache();
    $array['priorite'] = zend_disk_cache_fetch("PILOTCA::PRIORITES");
  	$array['bornes'] = zend_disk_cache_fetch("PILOTCA::BORNES");
  	$array['agence1'] = zend_disk_cache_fetch("PILOTCA::AGENCESN1");
  	$array['agence2'] = zend_disk_cache_fetch("PILOTCA::AGENCESN2");	
	header('Content-Type: application/json');
	echo json_encode($array);
}
//Reset le cache
if(isset($_GET['reset']))
{
	$destroyCache = zend_disk_cache_clear("PILOTCA");
	
	if($destroyCache)
	{
		echo 'CLEAR';
	}
	else
	{
		echo 'PAS CLEAR';
	}
}
//Renvoit les agences en fonction de la DI sélectionnée
if(isset($_GET['agence']))
{	
	$tabAgences2 = zend_disk_cache_fetch("PILOTCA::AGENCESN2");
	$result = array();
	$idFrom =  $_GET['$di'];
	
	$di = $_POST[$idFrom];
	
	$tabAgences1 = zend_disk_cache_fetch("PILOTCA::AGENCESN1");
	foreach($tabAgences2 as $i=>$a)
	{
		if($a[2] == $tabAgences1[$di-1][1])
		{
			$result[] = $a;
		}
	}
	header('Content-Type: application/json');
	echo json_encode($result);
}

?>