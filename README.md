# usage

### prereq

you need node, you can use creationix/nvm to get node

### configure

edit config.js 

### run

i am using `npx node-dev server.js` in a tmux session for now

### publish

i am currently proxying it with caddyserver at https://status.mov.dfh.name/

### wishlist

- alerting on state change (i wish vigil's script feature worked and/or it was not just for probing http sites. as you can see i needed simply to check a `netstat | grep` in my sample config. https://github.com/valeriansaliou/vigil/issues/62 it actually flat out does not work for me period regardless of docker (i didnt bother replying though just in case PEBCAK)
- discord webhook support (vigil doesn't plan to do it and i prefer discord because i dont have to ask anyone for smtp settings to set it up https://github.com/valeriansaliou/vigil/issues/44)

