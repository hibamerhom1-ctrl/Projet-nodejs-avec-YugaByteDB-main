# 📖 Guide de Démarrage - Étape par Étape

Application React/TypeScript complète avec backend Node.js/Express intégré à YugaByteDB pour la gestion de projets.

Ce guide vous explique comment démarrer le projet **sans aucune connaissance technique**. 
Il suffit de suivre les étapes dans l'ordre et de copier-coller les commandes.

---

## ✅ Prérequis (Vérifications avant de commencer)

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 18 ou plus récente)
   - Téléchargez depuis : https://nodejs.org/
   - Vérifiez l'installation : Ouvrez un terminal et tapez `node --version`
   - Vous devriez voir un numéro de version (ex: v18.17.0)

2. **Docker Desktop**
   - Téléchargez depuis : https://www.docker.com/products/docker-desktop/
   - Installez et démarrez Docker Desktop
   - Vérifiez l'installation : Ouvrez un terminal et tapez `docker --version`
   - Vous devriez voir un numéro de version

3. **Git** (optionnel, pour cloner le projet)
   - Téléchargez depuis : https://git-scm.com/downloads

---

## 🚀 ÉTAPE 1 : Ouvrir le Terminal

### Sur Windows :
- Appuyez sur `Windows + R`
- Tapez `cmd` ou `powershell` et appuyez sur Entrée
- OU cliquez droit sur le dossier du projet → "Ouvrir dans le terminal"

### Sur Mac/Linux :
- Appuyez sur `Cmd + Espace` (Mac) ou `Ctrl + Alt + T` (Linux)
- Tapez "Terminal" et appuyez sur Entrée

---

## 📂 ÉTAPE 2 : Aller dans le Dossier du Projet

Dans le terminal, tapez cette commande (remplacez le chemin par le chemin de VOTRE dossier) :

**Sur Windows :**
```bash
cd C:\Users\VotreNom\Desktop\Implementing-Project-With-YugaByteDB-main
```

**Sur Mac/Linux :**
```bash
cd ~/Desktop/Implementing-Project-With-YugaByteDB-main
```

**Note :** Adaptez le chemin selon l'endroit où vous avez placé le projet.

Vérifiez que vous êtes au bon endroit en tapant :

**Sur Windows :**
```bash
dir
```

**Sur Mac/Linux :**
```bash
ls
```

Vous devriez voir des fichiers comme `package.json`, `docker-compose.yml`, etc.

---

## 🐳 ÉTAPE 3 : Démarrer la Base de Données (YugaByteDB)

**Cette étape démarre la base de données dans Docker.**

Tapez cette commande :

```bash
docker-compose up -d
```

**Attendez 20-30 secondes** que la base de données démarre.

Vous devriez voir des messages comme :
```
Creating yugabytedb ... done
```

**Vérification :** Pour vérifier que tout fonctionne, tapez :
```bash
docker ps
```

Vous devriez voir un conteneur nommé `yugabytedb` avec le statut "Up".

---

## 📦 ÉTAPE 4 : Installer les Dépendances du Frontend

**Cette étape installe tous les outils nécessaires pour le frontend.**

Tapez cette commande :

```bash
npm install
```

**Cela peut prendre 2-5 minutes.** Attendez que la commande se termine.

Vous devriez voir à la fin :
```
added XXX packages
```

---

## 🔧 ÉTAPE 5 : Configurer le Backend

### 5.1 : Aller dans le Dossier Backend

Tapez :

```bash
cd backend
```

### 5.2 : Installer les Dépendances du Backend

Tapez :

```bash
npm install
```

**Cela peut prendre 1-3 minutes.** Attendez que la commande se termine.

### 5.3 : Créer le Fichier de Configuration

**Sur Windows (PowerShell) :**
```powershell
@"
DB_HOST=localhost
DB_PORT=5433
DB_NAME=projects_db
DB_USER=yugabyte
DB_PASSWORD=yugabyte
PORT=3000
"@ | Out-File -FilePath .env -Encoding utf8
```

**Sur Windows (CMD) :**
```cmd
echo DB_HOST=localhost > .env
echo DB_PORT=5433 >> .env
echo DB_NAME=projects_db >> .env
echo DB_USER=yugabyte >> .env
echo DB_PASSWORD=yugabyte >> .env
echo PORT=3000 >> .env
```

**Sur Mac/Linux :**
```bash
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5433
DB_NAME=projects_db
DB_USER=yugabyte
DB_PASSWORD=yugabyte
PORT=3000
EOF
```

### 5.4 : Initialiser la Base de Données

Tapez :

```bash
npm run init-db
```

Vous devriez voir des messages comme :
```
✅ Database connection successful
✅ Database initialized successfully
```

---

## 🖥️ ÉTAPE 6 : Démarrer le Serveur Backend

**IMPORTANT : Gardez ce terminal ouvert !**

Tapez :

```bash
npm run dev
```

Vous devriez voir :
```
🚀 Server running on http://localhost:3000
📊 Health check: http://localhost:3000/health
✅ Connected to YugaByteDB
```

**Ne fermez PAS ce terminal !** Laissez-le ouvert.

---

## 🎨 ÉTAPE 7 : Démarrer le Frontend

**Ouvrez un NOUVEAU TERMINAL** (gardez l'ancien ouvert avec le backend qui tourne).

### 7.1 : Retourner à la Racine du Projet

Dans le nouveau terminal, tapez :

**Sur Windows :**
```bash
cd C:\Users\VotreNom\Desktop\Implementing-Project-With-YugaByteDB-main
```

**Sur Mac/Linux :**
```bash
cd ~/Desktop/Implementing-Project-With-YugaByteDB-main
```

(Remplacez par votre chemin)

### 7.2 : Démarrer le Frontend

Tapez :

```bash
npm run dev
```

Vous devriez voir :
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Ne fermez PAS ce terminal non plus !**

---

## ✅ ÉTAPE 8 : Vérifier que Tout Fonctionne

### 8.1 : Ouvrir l'Application

1. Ouvrez votre navigateur (Chrome, Firefox, Edge, etc.)
2. Allez à l'adresse : **http://localhost:5173**

Vous devriez voir la page "Mes Projets".

### 8.2 : Tester l'Application

1. Cliquez sur le bouton **"Nouveau Projet"**
2. Remplissez le formulaire :
   - Nom du projet : Test
   - Description : Mon premier projet
   - Statut : En cours
   - Dates : Choisissez des dates
3. Cliquez sur **"Créer"**
4. Vérifiez que le projet apparaît dans la liste

**Si tout fonctionne, félicitations ! 🎉**

---

## 🔍 Vérifications Supplémentaires (Optionnel)

### Vérifier le Backend

Ouvrez dans votre navigateur : **http://localhost:3000/health**

Vous devriez voir :
```json
{"status":"Healthy","timestamp":"..."}
```

### Vérifier la Base de Données

Ouvrez dans votre navigateur : **http://localhost:7000**

C'est l'interface d'administration de YugaByteDB.

---

## 🛑 Comment Arrêter l'Application

### Pour arrêter le Frontend :
Dans le terminal du frontend, appuyez sur `Ctrl + C` (ou `Cmd + C` sur Mac)

### Pour arrêter le Backend :
Dans le terminal du backend, appuyez sur `Ctrl + C` (ou `Cmd + C` sur Mac)

### Pour arrêter la Base de Données :
Dans un terminal, tapez :
```bash
docker-compose down
```

---

## 🔄 Comment Redémarrer l'Application

### Pour redémarrer tout :

1. **Arrêter tout** (voir section ci-dessus)

2. **Redémarrer la base de données :**
```bash
docker-compose up -d
```

3. **Redémarrer le backend :**
```bash
cd backend
npm run dev
```

4. **Redémarrer le frontend** (dans un nouveau terminal) :
```bash
npm run dev
```

---

## ❌ Résolution de Problèmes

### Problème : "docker-compose : command not found"
**Solution :** Docker Desktop n'est pas installé ou pas démarré. Démarrez Docker Desktop.

### Problème : "npm : command not found"
**Solution :** Node.js n'est pas installé. Installez Node.js depuis https://nodejs.org/

### Problème : "Port 3000 already in use"
**Solution :** Un autre programme utilise le port 3000. Fermez-le ou changez le port dans `backend/.env`

### Problème : "Port 5173 already in use"
**Solution :** Un autre programme utilise le port 5173. Fermez-le.

### Problème : "Cannot connect to database"
**Solution :** 
1. Vérifiez que Docker est démarré : `docker ps`
2. Vérifiez que YugaByteDB est démarré : `docker-compose ps`
3. Redémarrez YugaByteDB : `docker-compose restart`

### Problème : "Module not found"
**Solution :** Les dépendances ne sont pas installées. Exécutez `npm install` dans le dossier concerné.

---

## 📝 Résumé des Commandes Principales

```bash
# 1. Démarrer la base de données
docker-compose up -d

# 2. Installer les dépendances frontend
npm install

# 3. Installer les dépendances backend
cd backend
npm install

# 4. Créer le fichier .env (voir étape 5.3)

# 5. Initialiser la base de données
npm run init-db

# 6. Démarrer le backend
npm run dev

# 7. Démarrer le frontend (dans un nouveau terminal)
cd .. (retour à la racine)
npm run dev
```

---

## 🎯 URLs Importantes

- **Application Frontend :** http://localhost:5173
- **API Backend :** http://localhost:3000/api
- **Health Check Backend :** http://localhost:3000/health
- **YugaByteDB Master UI :** http://localhost:7000
- **YugaByteDB TServer UI :** http://localhost:9000

---

## 🛠️ Technologies utilisées

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Base de données**: YugaByteDB (compatible PostgreSQL)
- **Docker**: Pour l'isolation de YugaByteDB

## 📋 Fonctionnalités

- ✅ Gestion complète de projets (CRUD)
- ✅ Interface utilisateur moderne et responsive
- ✅ Recherche et filtrage
- ✅ Tri des projets (par date, par nom)
- ✅ Validation des données
- ✅ Gestion d'erreurs robuste
- ✅ Notifications de succès
- ✅ Interface entièrement en français

---

## 💡 Conseils

1. **Gardez les terminaux ouverts** pendant que l'application tourne
2. **Ne fermez pas Docker Desktop** pendant que vous utilisez l'application
3. **En cas d'erreur**, lisez les messages dans les terminaux - ils indiquent souvent le problème
4. **Sauvegardez vos données** avant de supprimer les conteneurs Docker

---

## 📚 Documentation Complémentaire

Pour plus de détails techniques, consultez :
- [YUGA_BYTEDB_SETUP.md](./YUGA_BYTEDB_SETUP.md) - Guide d'installation et de configuration détaillé
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Guide d'intégration de base de données
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Exemples d'intégration API

---

**Bon développement ! 🚀**
