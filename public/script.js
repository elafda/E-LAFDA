document.getElementById("generateLinkBtn").addEventListener("click", async () => {
    const topic = document.getElementById("lafdaTitle").value;
    if (!topic) return alert("Enter a topic!");

    const response = await fetch("/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
    });

    const data = await response.json();
    if (data.lafdaId) {
        document.getElementById("lafdaLink").value = data.roomLink;
        document.getElementById("linkContainer").classList.remove("hidden");
    }
});

function copyLink() {
    const link = document.getElementById("lafdaLink");
    link.select();
    document.execCommand("copy");
    alert("Link copied!");
}
