<?php
	include_once("lib/dbcnx.php");

	session_start();
	$codeUser = $_SESSION['code_user'];

	if(isset($_GET['getMesInters']))
	{
		if($_SESSION['code_user'] == '')
		{
			echo "je suis modin et je suce pour pas chère sisi négro";
		}
		else
		{
			$req = "SELECT Code_intervention, TIME(Date_prevue) Heure_prevue
			FROM T_PILOTAGE
			WHERE code_agent = '".$_SESSION['code_user']."'
			AND id_etat IN (1, 4)
			AND DATE(Date_prevue) = '2013-03-13'
			ORDER BY 2";

			$query = $cnxBdd->prepare($req);
			$query->execute();
			$res = $query->fetchAll(PDO::FETCH_ASSOC);

			header('Content-Type: application/json;');
			echo json_encode($res);
		}
	}

	if(isset($_GET['getMonInter']))
	{
		$codeInter = $_POST['codeInter'];

		$req = "SELECT Code_intervention, TIME(Date_prevue) Heure_prevue, TIME(DATE_DEBUT_REELLE) Heure_debut, Duree_prevue, Code_site, Code_postal, Id_priorite, Utilisateur
			FROM T_PILOTAGE
			WHERE code_intervention = '".$codeInter."'";

		$query = $cnxBdd->prepare($req);
		$query->execute();
		$res = $query->fetchAll(PDO::FETCH_ASSOC);

		header('Content-Type: application/json;');
		echo json_encode($res);
	}

?>