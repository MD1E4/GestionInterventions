// Evenement au chargement de la page "mesInterventions"
$('#mesInterventions').on('pageshow', function () {

    //Récupération de mes interventions dans la base de données
    $.ajax({
        type:'POST',
        url:'lib/mobile_interventions.php?getMesInters',
        datatype:'json',
        // En cas de succès du tratement php, le résultat est récuperé au format Json
        success:function(mesInters)
        {
            // Si il n'y a aucun résultat, c'est que la variable de session 
            // du fichier php contenant le numéro de l'utilisateur est vide
            if(mesInters == '')
            {
                alert('Veuillez vous connecter pour acceder à ce service');
                //On redirige l'utilisateur vers l'authentification
                $('#link_connect').click();
            }
            else
            {
                // On ajoute une entete à la liste des interventions
                var html = '<li data-role="list-divider"  role="heading">Le 13/03/2013</li>';

                // On parcourt la liste des interventions récupérées
                for( var i = 0 ; i < mesInters.length ; i++ )
                {
                    var linter = mesInters[i];
                    // On ajoute chaque intervention à la liste
                    html += '<li><a class="lesInters" title="'+linter.Code_intervention+'" href="#monIntervention">'+linter.Heure_prevue+'</a></li>';
                }
                // On vide la liste HTML5
                $('#list_mesInterventions').empty();
                // On ajoute les éléments à la liste
                $('#list_mesInterventions').append(html);
                // On rafraichit l'affichage de la listz
                $('#list_mesInterventions').listview('refresh', true);
            }
        },
        // En cas d'erreur rencontrée dans le fichier php
        error:function()
        {
            alert('Erreur lors du chargement de vos interventions');
        }
    });

    // A la sélection d'une intervention dans la liste
    $('#list_mesInterventions').on('click', '.lesInters', function() {
        // Récupépation des informations de l'intervention sélectionée
        $.ajax({
            type:'POST',
            url:'lib/mobile_interventions.php?getMonInter',
            datatype:'json',
            data:{ codeInter:$(this).attr('title') },
            // En cas de succès du tratement php, le résultat est récuperé au format Json
            success:function(monInter)
            {
                // On vide les éléments où ont affichés les informations
                $('.infoInter').empty();
                // On affiche les informations de l'intervention sélectionnée
                $('#iNumero').append(monInter[0].Code_intervention);
                $('#iLieu').append(monInter[0].Code_site);
                $('#iUtilisateur').append(monInter[0].Utilisateur);
                $('#iPriorite').append(monInter[0].Priorite);
                $('#iHPrevue').append(monInter[0].Heure_prevue.substr(0,5));
                $('#iDPrevue').append(monInter[0].Duree_prevue);
            },
            // En cas d'erreur dans le fichier php
            error:function()
            {
                alert('Erreur lors du chargement de vos interventions');
            }
        });

    });
});