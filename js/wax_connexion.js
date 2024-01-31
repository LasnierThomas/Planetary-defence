const wax = new waxjs.WaxJS({
    rpcEndpoint: 'https://wax.greymass.com'
});

async function login() {
    try {
        let userAccount = await wax.login();
        console.log("Connecté:", userAccount);

        // Enregistrer les informations dans le local storage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userAccount', userAccount);
		window.location.href = '../accueil.html'// POUR LINSTANT
        // Vérifiez le type d'utilisateur et redirigez si nécessaire
        //let redirect = await verifyUserType(userAccount);
        //if (redirect) {
        //    window.location.href = '../accueil.html';
        //}
    } catch (e) {
        console.error("Erreur de connexion:", e.message);
        if (document.getElementById('loginresponse')) {
            document.getElementById('loginresponse').append(e.message);
        }
    }
}

async function verifyUserType(userAccount) {
    let isOwner = await checkOwnerStatus(userAccount);
    if (isOwner) {
        return true;
    } else {
        let isPlayer = await checkPlayerStatus(userAccount);
        if (isPlayer) {
            return true;
        } else {
            await processPayment(userAccount);
            return false; // Ne pas rediriger après le processus de paiement
        }
    }
}


// Fonction pour vérifier si l'utilisateur est un owner
async function checkOwnerStatus(userAccount) {
    try {
        const apiUrl = 'https://wax-testnet.cryptolions.io/v1/chain/get_table_rows';
        const contractAccount = 'magortestne4'; // Replace with the contract account name
        const tableName = 'owners'; // Replace with the table name

        const requestData = {
            json: true,
            code: contractAccount,
            scope: contractAccount,
            table: tableName,
            lower_bound: userAccount,
            upper_bound: userAccount,
            limit: 1,
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (responseData.rows && responseData.rows.length > 0) {
            return true; // If at least one result is found, the owner exists
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Error checking owner existence: ${error}`);
        return false;
    }
}

// Vérifie si l'utilisateur est un player
async function checkPlayerStatus(userAccount) {
    try {
        const apiUrl = 'https://wax-testnet.cryptolions.io/v1/chain/get_table_rows';
        const contractAccount = 'magortestne4'; // Replace with the contract account name
        const tableName = 'players'; // Replace with the table name

        const requestData = {
            json: true,
            code: contractAccount,
            scope: contractAccount,
            table: tableName,
            lower_bound: userAccount,
            upper_bound: userAccount,
            limit: 1,
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (responseData.rows && responseData.rows.length > 0) {
            return true; // If at least one result is found, the owner exists
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Error checking player existence: ${error}`);
        return false;
    }
}

async function processPayment(userAccount) {
    console.log('Début du processus de paiement pour le compte:', userAccount);

    try {
        const quantity = '0.0001 TLM';
        const to = 'magordefense';
        const memo = 'Inscription du joueur';

        console.log('Préparation de la transaction de paiement...');
        console.log(`Montant: ${quantity}, Destinataire: ${to}, Memo: ${memo}`);

        const transferResult = await wax.api.transact({
            actions: [{
                account: 'alien.worlds',
                name: 'transfer',
                authorization: [{
                    actor: userAccount,
                    permission: 'active',
                }],
                data: {
                    from: userAccount,
                    to: to,
                    quantity: quantity,
                    memo: memo,
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        //transaction()
        console.log('Résultat de la transaction de transfert:', transferResult);
        //Une fois que le joueur a payer L'ajouter dans la liste "player" qui seras update tous les jours 

    } catch (e) {
        console.error('Erreur de transaction:', e);
    }
}
