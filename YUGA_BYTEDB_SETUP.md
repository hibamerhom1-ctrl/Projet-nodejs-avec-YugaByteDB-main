# Guide d'Intégration YugaByteDB - Complet

Ce guide vous explique comment intégrer et utiliser YugaByteDB dans ce projet.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Initialisation de la base de données](#initialisation-de-la-base-de-données)
5. [Démarrage de l'application](#démarrage-de-lapplication)
6. [Vérification](#vérification)
7. [Structure du projet](#structure-du-projet)

## 🔧 Prérequis

- Docker et Docker Compose installés
- Node.js 18+ et npm
- Un terminal/console

## 📦 Installation

### Étape 1: Installer les dépendances du backend

```bash
cd server
npm install
```

### Étape 2: Installer les dépendances du frontend (si pas déjà fait)

```bash
# Depuis la racine du projet
npm install
```

## ⚙️ Configuration

### Étape 1: Créer le fichier .env pour le backend

Créez un fichier `server/.env` avec le contenu suivant:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_NAME=projects_db
DB_USER=yugabyte
DB_PASSWORD=yugabyte

# Server Configuration
PORT=3000
```

### Étape 2: Créer le fichier .env pour le frontend (optionnel)

Créez un fichier `.env` à la racine du projet:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🗄️ Initialisation de la base de données

### Méthode 1: Utiliser le script Node.js (Recommandé)

```bash
cd server
npm run init-db
```

Ce script va:
- Créer la base de données `projects_db` si elle n'existe pas
- Créer la table `projects` avec tous les champs nécessaires
- Créer les index pour optimiser les performances

### Méthode 2: Utiliser le script SQL directement

```bash
# Se connecter à YugaByteDB
psql -h localhost -p 5433 -U yugabyte -d yugabyte

# Dans le terminal psql, exécutez:
CREATE DATABASE projects_db;

# Puis connectez-vous à la nouvelle base:
\c projects_db

# Exécutez le script SQL
\i server/src/scripts/initDatabase.sql
```

### Méthode 3: Utiliser Docker exec

```bash
# Exécuter le script SQL via Docker
docker exec -i yugabytedb psql -U yugabyte -d yugabyte < server/src/scripts/initDatabase.sql
```

## 🚀 Démarrage de l'application

### Étape 1: Démarrer YugaByteDB avec Docker

```bash
# Depuis la racine du projet
docker-compose up -d
```

Vérifiez que le conteneur est bien démarré:

```bash
docker ps
```

Vous devriez voir le conteneur `yugabytedb` en cours d'exécution.

### Étape 2: Attendre que YugaByteDB soit prêt

Attendez environ 10-20 secondes pour que YugaByteDB soit complètement initialisé. Vous pouvez vérifier avec:

```bash
docker logs yugabytedb
```

Ou tester la connexion:

```bash
psql -h localhost -p 5433 -U yugabyte -d yugabyte -c "SELECT version();"
```

### Étape 3: Initialiser la base de données

```bash
cd server
npm run init-db
```

### Étape 4: Démarrer le serveur backend

```bash
cd server
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3000`

### Étape 5: Démarrer le frontend

Dans un nouveau terminal:

```bash
# Depuis la racine du projet
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:5173` (ou un autre port si 5173 est occupé)

## ✅ Vérification

### 1. Vérifier la connexion à YugaByteDB

#### Via le backend (Health Check)

Ouvrez votre navigateur ou utilisez curl:

```bash
curl http://localhost:3000/health
```

Vous devriez recevoir une réponse JSON:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### Via psql

```bash
psql -h localhost -p 5433 -U yugabyte -d projects_db -c "\dt"
```

Vous devriez voir la table `projects` listée.

### 2. Vérifier la structure de la table

```bash
psql -h localhost -p 5433 -U yugabyte -d projects_db -c "\d projects"
```

Vous devriez voir la structure complète de la table avec tous les champs.

### 3. Tester les opérations CRUD

#### Créer un projet (POST)

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projet Test",
    "description": "Description du projet test",
    "status": "active",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

#### Lire tous les projets (GET)

```bash
curl http://localhost:3000/api/projects
```

#### Mettre à jour un projet (PUT)

Remplacez `{id}` par l'ID retourné lors de la création:

```bash
curl -X PUT http://localhost:3000/api/projects/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projet Test Modifié",
    "description": "Nouvelle description",
    "status": "completed",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

#### Supprimer un projet (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/projects/{id}
```

### 4. Vérifier dans l'interface web

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Cliquez sur "New Project"
3. Remplissez le formulaire et créez un projet
4. Vérifiez que le projet apparaît dans la liste
5. Testez l'édition et la suppression

### 5. Vérifier directement dans la base de données

```bash
psql -h localhost -p 5433 -U yugabyte -d projects_db
```

Puis exécutez:

```sql
SELECT * FROM projects;
```

Vous devriez voir tous les projets créés via l'interface web.

## 📁 Structure du projet

```
.
├── docker-compose.yml          # Configuration Docker pour YugaByteDB
├── server/                     # Backend Node.js/Express
│   ├── src/
│   │   ├── index.ts           # Point d'entrée du serveur
│   │   ├── db/
│   │   │   └── connection.ts  # Configuration de la connexion YugaByteDB
│   │   ├── routes/
│   │   │   └── projects.ts    # Routes API pour les projets
│   │   └── scripts/
│   │       ├── initDatabase.ts # Script d'initialisation Node.js
│   │       └── initDatabase.sql # Script SQL d'initialisation
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                    # Configuration (à créer)
├── src/                        # Frontend React
│   ├── hooks/
│   │   └── useProjects.ts     # Hook avec intégration API
│   └── ...
└── .env                        # Variables d'environnement frontend (optionnel)
```

## 🔍 Dépannage

### Problème: "Connection refused" ou "Cannot connect to database"

**Solution:**
1. Vérifiez que Docker est en cours d'exécution: `docker ps`
2. Vérifiez que le conteneur YugaByteDB est démarré: `docker-compose ps`
3. Redémarrez le conteneur: `docker-compose restart`
4. Vérifiez les logs: `docker logs yugabytedb`

### Problème: "Database does not exist"

**Solution:**
1. Exécutez le script d'initialisation: `cd server && npm run init-db`
2. Ou créez manuellement la base: `CREATE DATABASE projects_db;`

### Problème: "Table does not exist"

**Solution:**
1. Exécutez le script d'initialisation: `cd server && npm run init-db`
2. Vérifiez que vous êtes connecté à la bonne base de données

### Problème: Le frontend ne peut pas se connecter au backend

**Solution:**
1. Vérifiez que le backend est démarré sur le port 3000
2. Vérifiez le fichier `.env` du frontend: `VITE_API_URL=http://localhost:3000/api`
3. Vérifiez la console du navigateur pour les erreurs CORS (normalement configuré)

### Problème: Erreurs TypeScript dans le backend

**Solution:**
1. Installez les dépendances: `cd server && npm install`
2. Vérifiez que TypeScript est installé: `npm list typescript`

## 🎯 Commandes utiles

```bash
# Démarrer YugaByteDB
docker-compose up -d

# Arrêter YugaByteDB
docker-compose down

# Voir les logs de YugaByteDB
docker logs yugabytedb

# Se connecter à YugaByteDB avec psql
psql -h localhost -p 5433 -U yugabyte -d projects_db

# Lister toutes les bases de données
psql -h localhost -p 5433 -U yugabyte -d yugabyte -c "\l"

# Lister toutes les tables
psql -h localhost -p 5433 -U yugabyte -d projects_db -c "\dt"

# Voir la structure d'une table
psql -h localhost -p 5433 -U yugabyte -d projects_db -c "\d projects"

# Compter les projets
psql -h localhost -p 5433 -U yugabyte -d projects_db -c "SELECT COUNT(*) FROM projects;"
```

## 📊 Interface YugaByteDB

YugaByteDB fournit également une interface web pour visualiser les données:

- **Master UI**: http://localhost:7000
- **TServer UI**: http://localhost:9000

Ces interfaces vous permettent de voir les métriques, les tables, et les données en temps réel.

## ✨ Fonctionnalités implémentées

- ✅ Connexion à YugaByteDB via PostgreSQL driver
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Health check endpoint
- ✅ Scripts d'initialisation automatiques
- ✅ Support TypeScript
- ✅ Intégration frontend complète

## 🎉 Félicitations!

Votre application est maintenant connectée à YugaByteDB et prête à être utilisée!

