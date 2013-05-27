<?php
	include_once("dbcnx.php");

	session_start();
	$codeUser = $_SESSION['code_user'];

	// On récupère les interventions de l'utilisateur suite à l'authentification
	if(isset($_GET['getMesInters']))
	{
		if($_SESSION['code_user'] == '')
		{
			echo "";
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

	// On récupère les informations sur l'intervention sélectionnée dans la liste de la page "mesInterventions"
	if(isset($_GET['getMonInter']))
	{
		$codeInter = $_POST['codeInter'];

		$req = "SELECT Code_intervention, TIME(Date_prevue) Heure_prevue, Duree_prevue, Code_site, prio.libelle Priorite, Utilisateur, Id_etat
			FROM T_PILOTAGE p INNER JOIN T_PRIORITE prio ON p.Id_priorite = prio.id
			WHERE code_intervention = '".$codeInter."'";

		$query = $cnxBdd->prepare($req);
		$query->execute();
		$res = $query->fetchAll(PDO::FETCH_ASSOC);

		header('Content-Type: application/json;');
		echo json_encode($res);
	}

	// On récupère les intervention à l'état en cours assigné à l'utilisateur
	if(isset($_GET['getEnCours']))
	{
		$req = "SELECT Code_intervention, TIME(Date_prevue) Heure_prevue
			FROM T_PILOTAGE
			WHERE id_etat = 4
			AND DATE(Date_prevue) = '2013-03-13'
			AND code_agent = '".$_SESSION['code_user']."'";

		$query = $cnxBdd->prepare($req);
		$query->execute();
		$res = $query->fetchAll(PDO::FETCH_ASSOC);

		header('Content-Type: application/json;');
		echo json_encode($res);
	}

	// Modifie l'intervention
	// Ajout de l'heure de début et passage à l'état en cours
	if(isset($_GET['startInter']))
	{

		$codeInter = $_POST['codeInter'];

		$req = "UPDATE T_PILOTAGE 
		SET id_etat = 4, date_debut_reelle = (SELECT CONCAT('2013-03-13 ', TIME(NOW()))) 
		WHERE code_intervention = '".$codeInter."'";

		$nbModif = $cnxBdd->exec($req);

		echo $nbModif;
	}

	// Modifie l'intervention
	// Ajout commentaire technicien
	// Ajout motif hors delai
	// Modification de l'état d'en cours à validée
	// Modification si l'intervention a été réalisée ou non
	if(isset($_GET['endInter']))
	{
		$codeInter = $_POST['codeInter'];
		$commentaire = $_POST['commentaire'];
		$motifHD = $_POST['motifHD'];
		$fait = $_POST['fait'];

		$req = "UPDATE T_PILOTAGE 
		SET id_etat = 2,
		date_fin_reelle = (SELECT CONCAT('2013-03-13 ', TIME(NOW()))),
		commentaire_technicien = '".$commentaire."',
		motif_hors_delai = '".$motifHD."',
		service_fait = '".$fait."'
		WHERE code_intervention = '".$codeInter."'";

		$nbModif = $cnxBdd->exec($req);

		echo $nbModif;
	}

?>