function copyToClipboard() {
    /* Get the text field */
    var copyText = document.getElementById("ShareableLink");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the 
     text */
    alert("Copied the text: " + copyText.value);
}
