<?php
include_once("dbcnx.php");

session_start();

$_SESSION['code_user']="";
// Authentification
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

// Chargement des agences de niveau 1 (DI)
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

// Chargement des agences de niveau 2 (Agence)
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

//Chargement des priorités
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

?>