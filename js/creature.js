// script.js
function updateCountdown() {
    const currentDate = new Date();
    const targetDate = new Date(currentDate);

    // Réglez la date cible sur le 1er du mois suivant à minuit
    targetDate.setMonth(targetDate.getMonth() + 1, 1);
    targetDate.setHours(0, 0, 0, 0);

    const timeDifference = targetDate - currentDate;
    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent = daysLeft + ' jours ' + hoursLeft + ' heures ' + minutesLeft + ' minutes ' + secondsLeft + ' secondes';

    // Retirer le flou lorsque le compte à rebours atteint zéro
    if (timeDifference <= 0) {
        document.querySelector('.creature img').classList.remove('blurry');
    }
}

// Mettre à jour le compte à rebours toutes les secondes
setInterval(updateCountdown, 1000);

// Appeler la fonction initiale pour afficher le compte à rebours au chargement de la page
updateCountdown();