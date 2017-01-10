#!/bin/sh
chsum1=""

while [[ true ]]
do
    chsum2=`find src/ example/ -type f -exec md5 {} \;`
    if [[ $chsum1 != $chsum2 ]] ; then
        gulp
        chsum1=$chsum2
    fi
    sleep 2
done
