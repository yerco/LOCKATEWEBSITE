# Local Setup

## Serve it
At the local root folder
```bash
$ php bin/console server:run localhost:<port chosen>
```

Open browser (or curl) http://localhost:<port chosen>

If faced with problems, it could be a permission/access problem
```bash
$ sudo rm -rf var/logs/* && sudo rm -rf var/cache/* && sudo rm -rf var/sessions/*
```


