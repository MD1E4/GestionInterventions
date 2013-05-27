// Evenement au chargement de la page "monIntervention"
$('#monIntervention').on('pageshow', function () {
	// Lors du click sur le bouton "paramètre" dans le header
	$('#cmdParam').on('click', function() {
		// On récupère les interventions à l'état en cours affecté à l'utilisateur dans la base de données
		$.ajax({
	        type:'POST',
	        url:'lib/mobile_interventions.php?getEnCours',
	        datatype:'json',
	        // En cas de succès du tratement php, le résultat est récuperé au format Json
	        success:function(mesInters)
	        {
	        	// Si il n'y a pas d'intervention à l'état en cours
	            if(mesInters.length == 0)
	            {
	            	//On affiche les paramètres de l'intervention
	                $('#link_deroulement').click();
	                // On affiche la div permettant de démarrer l'intervention
	                // et on cache celle pour l'arreter
	                $('#div_start').show();
					$('#div_end').hide();
	            }
	            // Si il y a une intervention à l'état en cours
	            else
	            {
	            	// Si l'intervention en cours n'est pas celle sélectionnée
	                if(mesInters[0].Code_intervention != $('#iNumero').text())
	                {
	                	alert('L\'intervention num\351ro '+mesInters[0].Code_intervention+' programm\351e \340 '+mesInters[0].Heure_prevue.substr(0,5)+' est d\351j\340 \340 l\'\351tat "En cours". \n Veuillez finir l\'intervention en cours avant d\'en commencer une nouvelle');
	                }
	                // Si l'intervention sélectionnée est à l'état en cours
	                else
	                {
	                	//On affiche les paramètres de l'intervention	
	                	$('#link_deroulement').click();
	                	// On affiche la div permettant d'arreter l'intervention en cours
	                	// et on cache celle pour la démarrer
	                	$('#div_end').show();
						$('#div_start').hide();
	                }
	            }
	        },
	        // En cas d'erreur rencontrée dans le fichier php
	        error:function()
	        {
	            alert('Erreur lors du chargement de vos interventions');
	        }
	    });
	});

});