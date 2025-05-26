<?php
// Exécute le script pour mettre à jour index.html
shell_exec("bash /var/www/html/Porte_Folio/stats.sh");

// Redirige automatiquement vers index.html
header("Location: index.html");
exit();
?>
