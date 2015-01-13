#!/bin/sh

echo "\n"
echo "[Sonde] Lancement de la sonde :\n"
echo "---------------"

sonde ()
{
    echo "[Sonde] Requête sur $1"

    # On récupère le code status dans le header de la page
    response=$(curl --write-out %{http_code} --silent --max-time 5000 --output /dev/null $1)

    echo "[Sonde] Status : $response"
    echo "---------------"

    # S'il n'est pas égal à 200
    if [ $response != 200 ]; then

        # On enregistre le code d'erreur + date + service concerné
        mysql -uroot -proot simplesonde -e "INSERT INTO history (code, date, service) VALUES ($response, NOW(), '$2');"

        # On récupère le temps en minutes du dernier mail envoyé
        lastmail=$(mysql -uroot -proot simplesonde --raw --batch -e "SELECT TIMESTAMPDIFF(MINUTE,date,NOW()) FROM history WHERE mail=true AND service='$2' ORDER BY id DESC LIMIT 1;" -s)

        # Si le dernier mail envoyé remonte à plus de 10 minutes
        if [ $response != 503 ] && ([ -z $lastmail ] || [ $lastmail -ge 10 ]); then

            # On affiche une notification sur l'écran de l'utilisateur
            notify-send -u critical "Sonde $2" "L'application ne répond plus\nCode d'erreur : $response" -i "/usr/share/icons/gnome/32x32/emotes/face-angry.png"

            # On envoie un mail à alert@monmail.com
            ssmtp alert@monmail.com < "./sondemail.txt"

            # On enregistre le dernier envoie de mail
            mysql -uroot -proot simplesonde -e "UPDATE history SET mail=true WHERE service='$2' ORDER BY id DESC LIMIT 1;"

        fi
    fi
}

sonde 'http://www.test.com/sonde1' 'description sonde1'
sonde 'http://www.test.com/sonde2' 'description sonde2'

echo "\n"
