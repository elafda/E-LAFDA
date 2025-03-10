function generateLafdaLink() {
    // Get the username input
    let username = document.getElementById("username").value.trim();

    // Validate username (only letters & numbers, no spaces)
    username = username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Check if username is empty
    if (username === "") {
        alert("Please enter a valid username!");
        return;
    }

    // Generate a random ID for uniqueness
    let randomId = Math.random().toString(36).substring(2, 8);

    // Create the final link
    let lafdaLink = `https://elafda.com/msg/${username}-${randomId}`;

    // Display the generated link
    document.getElementById("lafdaLink").innerHTML = `
        <strong>Your Anonymous Link:</strong> 
        <a href="${lafdaLink}" target="_blank">${lafdaLink}</a>
    `;
}
