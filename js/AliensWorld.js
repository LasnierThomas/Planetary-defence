function toggleMenu() {
            var menu = document.getElementById("menu-lateral");
            if (menu.style.left === "-250px") {
                menu.style.left = "0";
            } else {
                menu.style.left = "-250px";
            }
        }