# Linux-home

Dans le cadre de ma formation a la HEH j'ai appris a utiliser linux et cela m'as motiver a faire ce project.
Le but est d'avoir des services isolées dans des conteneurs dockers qui communiquent ensemble.

## Services :

DNS(bind9),
Web(Apache),
minecraft,
NodeJs.

## Structure : 

```
project-root/
│
├── docker-compose.yml
│
├── dns/
│   ├── Dockerfile
│   └── config/
│       └── zones/
│           └── (fichiers BIND)
│
├── minecraft/
│   └── words/
│       └── (fichiers Minecraft)
│
├── nodejs/
│   ├── Dockerfile
│   └── serv.js
│
├── web/
│   └── sites/
│       ├── html/
│       │   └── index.html (exemple)
│       └── virtualHosts/
│           └── custom-vhost.conf (si besoin)
│
└── README.md

```
