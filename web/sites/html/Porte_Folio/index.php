<?php
$output = shell_exec('/var/www/html/Porte_Folio/stats.sh');
echo "<pre>$output</pre>";

include 'index.html'; // si tu veux garder l'affichage HTML original
?>
