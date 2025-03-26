document.addEventListener("DOMContentLoaded", function () {
    const joinLafdaBtn = document.getElementById("joinLafdaBtn");
    const generateLinkBtn = document.getElementById("generateLinkBtn");

    joinLafdaBtn.addEventListener("click", async () => {
        const lafdaCode = document.getElementById("lafdaCode").value.trim();
        if (!lafdaCode) {
            alert("Please enter a valid Lafda Code!");
            return;
        }

        window.location.href = `http://127.0.0.1:8000/join/${lafdaCode}`;
    });

    generateLinkBtn.addEventListener("click", async () => {
        const lafdaTitle = document.getElementById("lafdaTitle").value.trim();
        if (!lafdaTitle) {
            alert("Please enter a topic!");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/create-lafda/?topic=${encodeURIComponent(lafdaTitle)}`, {
                method: "POST",
            });
            const data = await response.json();

            if (response.ok) {
                document.getElementById("lafdaLink").value = data.link;
                document.getElementById("linkContainer").classList.remove("hidden");
            } else {
                alert("Error creating Lafda: " + data.detail);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});

function copyLink() {
    const lafdaLinkInput = document.getElementById("lafdaLink");
    lafdaLinkInput.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}
