// Evenement au chargement de la page "conneciton"
$('#connexion').on('pageshow', function () {
    // Lors de l'évenement click sur le bouton d'authentification
    $('#cmdConnect').on('click', function(){
        // Controle d'erreur de la saisie de l'utilisateur
        if ($('#idUser').val() == '' && $('#pwdUser').val() == '') 
        {
            alert('Veuillez saisir votre identifiant et votre mot de passe');
        }
        else if($('#idUser').val() == '') 
        {
            alert('Veuillez saisir votre identifiant');
        }
        else if($('#pwdUser').val() == '')
        {
            alert('Veuillez saisir votre mot de passe');
        }
        // Si la saisie est bonne
        else
        {
            // On vérifie si le nom d'utilisateur et le mot de passe entré sont correctes
            $.ajax({
                type:'POST',
                url:'lib/consult_inter.php?connect',        
                datatype:'json',
                data:{ idUser: $('#idUser').val(), pwdUser: $('#pwdUser').val() },
                // En cas de succès du tratement php, le résultat est récuperé au format Json
                success:function(res) 
                {
                    // Si la requete ne renvoit rien on informe l'utilisateur
                    if(res=='')
                    {
                        alert('Le nom d\'utilisateur ou le mot de passe n\'est pas valide');
                    }
                    // Sinon...
                    else
                    {
                        // ...On vérifie si l'utilisateur est bien habilité à acceder au service
                        var ok = false;
                        var index;
                        for (var i = 0; i < res.length; i++) 
                        {
                            if(res[i].Groupe == 'Technicien')
                            {                               
                                ok = true;
                                index = i;
                                break;
                            }

                                        
                        }
                        // S'il n'est pas habilité à acceder au service on l'en informe
                        if(ok == false)
                        {
                            alert('Vous n\'êtes pas habilité à acceder à l\'outil');
                        }
                        // Sinon on lui affiche ses interventions
                        else
                        {
                            user = res[index].Prenom+' '+res[index].Nom;
                            smallUser = res[index].Prenom.substr(0,1)+'. '+res[index].Nom;
                            alert('Bienvenue '+user);
                            $('#foot_mesInterventions, #foot_monIntervention, #foot_monIntervention_deroulement').empty();
                            $('#foot_mesInterventions, #foot_monIntervention, #foot_monIntervention_deroulement').append(smallUser);
                            $('#link_mesInterventions').click();
                        }
                    }
                },
                // En cas d'erreur rencontrée dans le fichier php
                error:function()
                {
                    alert('Problème de connexion au serveur, veuillez réessayer ultérieurement')
                }
            });
        }
    });
});