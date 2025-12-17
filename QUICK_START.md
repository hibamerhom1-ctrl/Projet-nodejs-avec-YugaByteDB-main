# 🚀 Guide de Démarrage Rapide

## Étapes pour démarrer le projet avec YugaByteDB

### 1️⃣ Démarrer YugaByteDB

```bash
docker-compose up -d
```

Attendez 10-20 secondes que YugaByteDB soit prêt. Vérifiez avec:

```bash
docker logs yugabytedb
```

### 2️⃣ Configurer et démarrer le backend

```bash
cd server

# Créer le fichier .env
echo "DB_HOST=localhost
DB_PORT=5433
DB_NAME=yugabyte
DB_USER=yugabyte
DB_PASSWORD=yugabyte
PORT=3000" > .env

# Installer les dépendances
npm install

# Initialiser la base de données
npm run init-db

# Démarrer le serveur
npm run dev
```

Le backend devrait être accessible sur `http://localhost:3000`

### 3️⃣ Démarrer le frontend

Dans un **nouveau terminal**:

```bash
# Depuis la racine du projet
npm run dev
```

Le frontend devrait être accessible sur `http://localhost:5173`

### 4️⃣ Vérifier que tout fonctionne

1. **Test du backend**: Ouvrez http://localhost:3000/health
   - Vous devriez voir: `{"status":"ok","database":"connected",...}`

2. **Test du frontend**: Ouvrez http://localhost:5173
   - Cliquez sur "New Project"
   - Créez un projet
   - Vérifiez qu'il apparaît dans la liste

3. **Test direct de la base de données**:
```bash
psql -h localhost -p 5433 -U yugabyte -d yugabyte -c "SELECT * FROM projects;"
```

## ✅ C'est tout!

Votre application est maintenant fonctionnelle avec YugaByteDB!

## 🔧 Commandes utiles

```bash
# Arrêter YugaByteDB
docker-compose down

# Voir les logs
docker logs yugabytedb

# Redémarrer YugaByteDB
docker-compose restart

# Se connecter à la base de données
psql -h localhost -p 5433 -U yugabyte -d yugabyte
```

## 📚 Documentation complète

Pour plus de détails, consultez [YUGA_BYTEDB_SETUP.md](./YUGA_BYTEDB_SETUP.md)

