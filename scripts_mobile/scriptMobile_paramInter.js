// Evenement au chargement de la page "monIntervention_deroulement"
$('#monIntervention_deroulement').on('pageshow', function () {

	/*$.ajax({
        type:'POST',
        url:'mobile_interventions.php?getEnCours',
        datatype:'json',
        // En cas de succès du tratement php, le résultat est récuperé au format Json
        success:function(mesInters)
        {
            if(mesInters.length == 0)
            {
                $('#div_start').show();
				$('#div_end').hide();
            }
            else
            {
            	$('#div_end').show();
				$('#div_start').hide();
            }
        },

        error:function()
        {
            alert('Erreur lors du chargement de vos interventions');
        }
	});*/

	// Lors du click pour démarrer l'intervention
	$('#cmdStart').on('click', function(){
		$.ajax({
			type:'POST',
			url:'lib/mobile_interventions.php?startInter',
			datatype:'json',
			data: { codeInter:$('#iNumero').text() },
			// En cas de succès du tratement php, le résultat est récuperé au format Json
			success:function(res)
			{
				// Si l'intervention à bien été modifiée on affiche la div permettant de l'arreter
				if(res == 1)
				{

					alert('L\'intervention \340 d\351marr\351e avec succ\350s');
					$('#div_end').show();
					$('#div_start').hide();
				}
				// Sinon on en informe l'utilisateur
				else
				{
					alert('Erreur lors du d\351marage de l\'intervention, veuillez r\351essayer ult\351rieurement');
				}
			},
			// En cas d'erreur rencontrée dans le fichier php
			error:function()
			{
				alert('Erreur lors du d\351marage de l\'intervention, veuillez r\351essayer ult\351rieurement');
			}
		});
	});
	// Lors du click pour arreter l'intervention
	$('#cmdEnd').on('click', function(){
		$.ajax({
			type:'POST',
			url:'lib/mobile_interventions.php?endInter',
			datatype:'json',
			data: {
					codeInter:$('#iNumero').text(),
					commentaire:$('#txtCommentaire').val(),
					motifHD:$('#txtMotifHD').val(),
					fait:$("input[type='radio']:checked").val()
				},
			// En cas de succès du tratement php, le résultat est récuperé au format Json
			success:function(res)
			{

				if(res == 1)
				{
					// Si l'intervention à bien été modifiée on retourne sur la page "mesInterventions"
					alert('L\'intervention s\'est termin351e avec succ\350s');
					$('#link_mesInterventions').click();
				}
				// Sinon on en informe l'utilisateur
				else
				{
					alert('Une erreur est survenue lors de la close de l\'intervention, veuillez r\351essayer ult\351rieurement');
				}
			},
			// En cas d'erreur rencontrée dans le fichier php
			error:function()
			{
				alert('Une erreur est survenue lors de la close de l\'intervention, veuillez r\351essayer ult\351rieurement');
			}
		});
	});
});