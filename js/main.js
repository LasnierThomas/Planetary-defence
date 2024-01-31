function generateImgUrl(chemin) {
  const baseUrl = "https://atomichub-ipfs.com/ipfs/";
  const imgUrl = `${baseUrl}${chemin}`;
  return imgUrl;
}

window.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userAccount = localStorage.getItem("userAccount");
  const userType = localStorage.getItem("userType");

  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "login-wax.html";
    return;
  }

  console.log(`Connecté avec le compte: ${userAccount}`);
  document.getElementById("wam").textContent = userAccount;

  try {
    const playerResponse = await fetch("https://wax.cryptolions.io/v1/chain/get_table_rows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: "federation",
        table: "players",
        scope: "federation",
        json: true,
        limit: 100,
        lower_bound: userAccount,
        upper_bound: userAccount,
      }),
    });

    if (!playerResponse.ok) {
      throw new Error("Problème lors de la récupération des données");
    }

    const playerData = await playerResponse.json();
    console.log(playerData.rows[0]);
    document.getElementById("name").textContent = playerData.rows[0].tag;

    const assetResponse = await fetch(`https://wax.api.atomicassets.io/atomicassets/v1/assets/${playerData.rows[0].avatar}`);
    if (!assetResponse.ok) {
      throw new Error("Problème lors de la récupération des informations de l'avatar");
    }
    const assetData = await assetResponse.json();
    const imageUrl = generateImgUrl(assetData.data.template.immutable_data.img);
    document.getElementById("avatarImage").src = imageUrl;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Remplacez 'votreOwner' par le nom du propriétaire dont vous voulez afficher les données
  const userAccount = localStorage.getItem("userAccount");
  const ownerName = userAccount;
  const userType = localStorage.getItem("userType");
  console.log(ownerName);
  console.log(userType);
  if (userType === "owner") {
    fetchData("/data", userAccount);
  } else {
    fetchData("/players", userAccount);
  }

  // Fonction pour calculer les statistiques globales
  function calculateStats(data, identifier) {
    // Recherchez d'abord parmi les owners
    let entry = data.find((obj) => obj.owner === identifier);

    // Si non trouvé parmi les owners, recherchez parmi les players
    if (!entry) {
      entry = data.find((obj) => obj.player === identifier);
    }

    // Si une entrée est trouvée (que ce soit un owner ou un player)
    if (entry) {
      return {
        totalDefense: entry.defense.totalDefense,
        totalDefenseArm: entry.defense.totalDefenseArm,
        totalAttack: entry.defense.totalAttack,
        totalAttackArm: entry.defense.totalAttackArm,
        totalMoveCost: entry.defense.totalMoveCost,
        totalCrewSlots: entry.Nombre_slots,
        totalCrewNumber: entry.crew_number,
        totalArmNumber: entry.arm_number,
        // Ajoutez d'autres champs si nécessaire
      };
    } else {
      // Retourner des valeurs par défaut si ni owner ni player n'est trouvé
      return {
        totalDefense: 0,
        totalDefenseArm: 0,
        totalAttack: 0,
        totalAttackArm: 0,
        totalMoveCost: 0,
        totalCrewSlots: 0,
        totalCrewNumber: 0,
        totalArmNumber: 0,
        // Ajoutez d'autres champs par défaut si nécessaire
      };
    }
  }

  // Fonction pour mettre à jour l'affichage des statistiques
  function updateStatsDisplay(stats) {
    document.getElementById("defenseScore").textContent = `${stats.totalDefense}`;
    document.getElementById("defenseArmScore").textContent = `${stats.totalDefenseArm}`;
    document.getElementById("attackScore").textContent = `${stats.totalAttack}`;
    document.getElementById("attackArmScore").textContent = `${stats.totalAttackArm}`;
    document.getElementById("moveCost").textContent = `${stats.totalMoveCost}`;
    document.getElementById("crewSlotsAvailable").textContent = `${stats.totalCrewSlots}`;
    document.getElementById("crewNumber").textContent = `${stats.totalCrewNumber}`;
    document.getElementById("weaponsCount").textContent = `${stats.totalArmNumber}`;
  }

  function fetchData(endpoint, ownerName) {
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        const stats = calculateStats(data, ownerName);
        updateStatsDisplay(stats);
      })
      .catch((error) => console.error("Erreur lors de la récupération des données:", error));
  }
});

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userAccount");
  window.location.href = "login-wax.html";
}

async function checkIfForge(ownerName) {
  try {
    const apiUrl = "https://wax-testnet.cryptolions.io/v1/chain/get_table_rows";
    const contractAccount = "magortestne4";
    const tableName = "forge";

    const requestData = {
      json: true,
      code: contractAccount,
      scope: contractAccount,
      table: tableName,
      lower_bound: ownerName,
      upper_bound: ownerName,
      limit: 1,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    console.log(responseData);
    return responseData.rows && responseData.rows.length > 0;
  } catch (error) {
    console.error(`Error checking owner existence: ${error}`);
    return false;
  }
}

async function updateForgeStatus() {
  const forgeStatusElement = document.getElementById("forgeStatus");
  const userAccount = localStorage.getItem("userAccount");

  // Attendre la réponse de checkIfForge
  const isForgeActive = await checkIfForge(userAccount);

  if (isForgeActive) {
    forgeStatusElement.style.color = "green"; // Texte en vert si la forge est active
    forgeStatusElement.textContent = "forge : Active";
  } else {
    forgeStatusElement.style.color = "red"; // Texte en rouge si la forge n'est pas active
    forgeStatusElement.textContent = "forge : Inactive";
  }
}

updateForgeStatus();

document.getElementById("leaderboardLink").addEventListener("click", async function (event) {
  event.preventDefault(); // Empêche le comportement par défaut du lien
  const userAccount = localStorage.getItem("userAccount");
  const ownerName = userAccount; // Remplacez par le nom de l'utilisateur approprié
  console.log("forge", ownerName);

  const isOwner = await checkIfForge(ownerName);

  if (isOwner) {
    window.location.href = "forge.html";
  } else {
    window.location.href = "forge1.html";
  }
});
