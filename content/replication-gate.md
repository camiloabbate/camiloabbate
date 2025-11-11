---
title: "Secure Replication Files"
output: html_document
date: "2025-11-11"
---

title: "Secure Replication Files"Note: Ensure this file is saved directly in content/draft: false toc: false<div class="container text-center py-5"><div class="row justify-content-center"><div class="col-lg-8"><h2 class="mb-4">Access Restricted: Replication Materials</h2><p>This file is private to comply with the publishing restrictions of theSouthern Economic Journal (SEJ). Please enter the provided password to continue.</p><div id="password-form"><input type="password" id="password-input" placeholder="Enter Password" class="form-control mb-3"><button class="btn btn-primary" onclick="checkAccess()">Submit</button></div>        <!-- This is the content shown AFTER correct password entry -->
        <div id="download-content" style="display:none;" class="mt-4 p-4 border rounded shadow-sm bg-light">
            <h3 class="text-success">Access Granted!</h3>
            <p>
                Thank you. Click the link below to download the complete replication package 
                (STATA dta and do files).
            </p>
            <!-- Link points to the ZIP file saved in the static/ folder -->
            <a href="/VAR_Replication_Abbate.zip" class="btn btn-lg btn-success mt-3" download>
                Download Replication Files (ZIP)
            </a>
        </div>
        
        <div id="error-message" style="display:none;" class="mt-4 text-danger">
            Incorrect Password. Please check the credentials provided in the application statement.
        </div>
    </div>
</div>
</div><script>// NOTE: The password is included here for client-side functionality.const CORRECT_PASSWORD = "RationalAltruism2026!";function checkAccess() {const input = document.getElementById('password-input').value;// Hide input/error elements initially
document.getElementById(&#39;password-form&#39;).style.display = &#39;none&#39;;
document.getElementById(&#39;error-message&#39;).style.display = &#39;none&#39;;

if (input === CORRECT_PASSWORD) {
    document.getElementById(&#39;download-content&#39;).style.display = &#39;block&#39;;
} else {
    // If incorrect, show error and allow re-try
    document.getElementById(&#39;error-message&#39;).style.display = &#39;block&#39;;
    document.getElementById(&#39;password-form&#39;).style.display = &#39;block&#39;;
    document.getElementById(&#39;password-input&#39;).value = &#39;&#39;; // Clear input
}
}</script>
