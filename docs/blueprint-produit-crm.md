# Blueprint produit — Cuberfit CRM

Architecture complète : navigation, pages, fiches, workflows et dashboards.
Rédigé en me positionnant comme responsable produit du CRM (inspiration Salesforce
Sales/Service Cloud, HubSpot, Zendesk, Monday CRM, Intercom, Amplitude), mais
**chaque choix est ancré dans le contexte réel de Cuberfit Access** — pas un
copier-coller générique.

## 0. Sources & limites

Ancré sur : le prompt de cadrage initial (personas CS, Score de risque, SLA — voir
`~/Downloads/Prompt_CRM_Cuberfit_Fable5_v2.md`) + 5 documents Cuberfit Access
fournis le 2026-07-03 (`Vision et cadrage produit`, `Mapping fonctionnel`,
`Mapping technique V1`, `Story Map MVP et post-MVP`, `Priorisation post-MVP`).

**Limites à connaître :**
- Les 5 fichiers `.md` sont des exports de tableau Miro/FigJam en OCR, avec du
  texte dupliqué/superposé. J'ai dédupliqué et reconstitué le sens, mais
  certains éléments (chiffres, libellés exacts) méritent une relecture rapide
  de ta part avant diffusion à l'équipe.
- Le fichier `CUBERFIT.fig` est un binaire propriétaire que je ne peux pas
  ouvrir directement — la charte ci-dessous vient de captures d'écran du
  design system fournies le 2026-07-06 (voir sous-section suivante), pas
  d'une lecture du fichier lui-même.
- Point de validation croisée intéressant trouvé dans le Mapping technique :
  Cuberfit note déjà *"Arbitrage à faire sur le CRM à utiliser"* et utilise
  Notion comme pis-aller — ce projet CRM est donc bien la réponse officielle à
  un besoin déjà identifié en interne, pas une initiative parallèle.

**Charte visuelle (Cuberfit Access) :**
- Couleur primaire `#3333CE` (RGB 51,51,206, ~50% des surfaces colorées),
  secondaire `#5E97E0` (RGB 94,151,224, ~30%).
- Palette alternative "Cuberfit Pro" : `#583499` / `#B0A3F2` — disponible si
  un module doit se distinguer visuellement, non utilisée par défaut.
- Typographie : une seule famille, **Poppins**, du Bold 50px (titres
  principaux) au Regular 14px (sous-titres/description), voir le detail dans
  le document Word associé.
- Encre/texte foncé et accent orange (aperçus sur les écrans logo) : valeurs
  exactes non fournies, estimées visuellement — à confirmer si besoin de
  précision pixel-perfect.

**Validé directement sur l'environnement de test (`test.dev.cuberfit.com`,
2026-07-07, navigation en lecture sur les comptes Passionné et Partenaire) :**
- Le système de crédits est actif et réel : paiement via **Wave**, pack 5
  crédits = 5 000 XOF, pack 20 crédits = 20 000 XOF, avec historique de
  transactions (achats, inscriptions séance, remboursements d'annulation).
- Le catalogue d'activités est déjà riche (~17 pages : RPM, Body Combat, Body
  Pump, Step, Body Attack, Hijama humide...), avec coach, durée, niveau, prix
  en crédits par séance.
- Un **programme de fidélité par niveaux est déjà en production** côté
  Passionné (Initié → Débutant → …), alors que la Priorisation Post-MVP le
  classait "post-MVP, impact élevé" — ce document de priorisation a donc déjà
  un peu de retard sur le produit réel, à garder en tête pour les prochains
  arbitrages.
- Le support Partenaire actuel est un simple lien vers un chat WhatsApp
  ("Assistance"), sans système de ticketing — confirme bien le besoin du
  module P0-5.
- **Terminologie produit réelle à reprendre dans ce document** (corrigée
  ci-dessous) : l'espace Partenaire utilise **"Lieux"** pour la gestion des
  emplacements (pas "Salle") et **"Équipes"** pour la gestion des membres —
  navigation réelle observée : Tableau de bord, Lieux, Activités, Calendrier,
  Finances, Équipes, Assistance, Mes paramètres.

**État d'avancement (mis à jour le 2026-07-07) :** le scope P0 complet du
prompt source est livré — P0-1 Contacts & comptes, P0-2 Onboarding &
lifecycle, P0-3 Score de risque & churn, P0-4 Communication multicanale,
P0-5 Tickets & support (PRs #1 à #7, toutes mergées sur `main`). Ce document
reste la carte d'ensemble pour le P1 (Pipeline, Analytics avancé,
Administration) — les sections ci-dessous indiquent module par module ce qui
est réellement construit (`✅ livré`) vs ce qui reste à faire.

**Document compagnon :** un PRD complet pour Cuberfit Access (le produit,
pas le CRM) a été rédigé le 2026-07-07 à partir du Vision Book, de l'AI
Roadmap et de l'AI Architecture Blueprint — voir `Cuberfit_Access_PRD.docx`.
Sa section 15 (Risques & arbitrages) signale un point pertinent pour la
suite de ce blueprint : l'organisation Customer Experience réelle (Vision
Book) définit des rôles plus riches que la liste générique de ce document —
notamment un **Activation Manager** côté Partenaires avec un parcours en 7
étapes détaillé, et un **Account Manager** côté Corporate post-signature. À
réconcilier avec la section 4 (Fiche Commercial) et la section 5.1 (Pipeline
Partenaires) avant de construire le P1.

**Faits structurants extraits de ces documents (repris tels quels dans les
choix ci-dessous) :**
- Personas confirmés : Awa Diallo (Passionnée B2C), Fatou Ndiaye (Coach
  indépendante), Mamadou Sarr (DRH QVT), Mamadou Fall (Ops interne
  Cuberfit), Mariam (co-fondatrice, Super Admin).
- Stack technique cible Cuberfit Access : Flutter (apps mobiles Passionné /
  Partenaire), Next.js (site web, portail QVT, back-office admin), NestJS
  (API backend), PostgreSQL (master + réplica, PgBouncer), Redis, S3/R2,
  Kong/AWS API Gateway, Claude (modération assistée), ElevenLabs (voix, à
  évaluer), LAM Africa Mobile (OTP/WhatsApp/STT-TTS), Wave / Orange Money /
  carte bancaire, Amplitude, Sentry/Datadog.
- KPIs de lancement MVP (juillet 2026, zone Dakar) : 10 entreprises QVT
  signées, 500 collaborateurs actifs, 35 % taux d'usage mensuel côté
  Corporate ; 15 000 téléchargements, 3 000 MAU, 50 partenaires actifs (sur
  350 référencés), 40 % taux d'activation, rétention 30j > 20 % côté grand
  public.
- Le système de crédits est un **double-crédit** (crédit B2C acheté, crédit
  Corporate financé par l'entreprise, crédit offert expirant à 1 mois et non
  transférable) — ce détail doit apparaître dans la Fiche Utilisateur et le
  dashboard Wallet.
- Fonctionnalités post-MVP déjà arbitrées comme prioritaires (impact élevé) :
  programme de fidélité/points, gestion des promotions par segment, capacité
  dynamique par créneau, rôles & permissions partenaires, Amplitude, "Last
  Spot", API santé (Apple/Samsung) sous réserve de certification HDS.

---

## 1. Architecture de l'information — navigation principale

Ton exemple générique (Dashboard → Clients → Entreprise → Pipeline →
Opportunités → Marketing → Support → Partenaires → Finance → Reporting →
Administration → Paramètres) fonctionne pour un CRM SaaS générique. Je l'adapte
au modèle **3 personas** de Cuberfit — qui est la vraie colonne vertébrale
métier (portefeuilles CSM, niveaux d'accompagnement, Score de risque) — plutôt que
de forcer un découpage Salesforce générique par-dessus.

```
Dashboard (vue exécutive, personnalisée par rôle)
 ↓
Passionnés          (comptes B2C — remplace "Clients")
 ↓
Partenaires         (comptes B2B2C — salles, studios, coachs, espaces bien-être)
 ↓
Entreprises QVT     (comptes B2B — remplace "Entreprise")
 ↓
Pipeline & Opportunités   (acquisition Partenaires + signature/renouvellement QVT)
 ↓
Marketing            (campagnes multicanal par segment/phase de lifecycle)
 ↓
Support              (tickets, SLA, CSAT, agent vocal)
 ↓
Wallet & Finance      (crédits, paiements, retraits, facturation B2B)
 ↓
Reporting & Analytics (les 20 dashboards, rapports exportables)
 ↓
Administration        (modération, validation, rôles, catalogue, conformité)
 ↓
Paramètres            (Score de risque, intégrations, templates, SLA)
```

Le module **Comptes** livré en P0-1 reste la fondation technique commune
(`Account` + `PassionneProfile` / `PartenaireProfile` / `EntrepriseQvtProfile`) ;
la navigation ci-dessus n'est qu'un filtre métier par segment au-dessus de cette
même table.

---

## 2. Pages par module

### Dashboard
- **Vue d'ensemble** — écran d'accueil, personnalisé par rôle (Admin voit tout,
  CSM voit son portefeuille, Sales voit son pipeline).
- **Mes alertes du jour** — comptes Score de risque rouge/orange nécessitant une
  action, tickets en dépassement de SLA, renouvellements à J-90/J-30.
- **Mon pipeline** (rôle Sales/BizDev) — opportunités par étape, prévisionnel.

### Passionnés (comptes B2C)
- Liste des Passionnés *(livré en P0-1)*, avec filtres cohortes/segments.
- Fiche Passionné 360° *(livré en P0-1)*.
- **Segmentation & cohortes** — par date d'inscription, quartier, objectif
  (santé/stress/muscle), statut abonnement.
- **Import/export** — CSV pour opérations ponctuelles (ex. migration Notion).

### Partenaires (comptes B2B2C)
> Reprend la navigation réelle observée côté espace Partenaire (Tableau de
> bord, Lieux, Activités, Calendrier, Finances, Équipes, Assistance), plus les
> vues spécifiquement CRM/admin qui n'existent pas côté partenaire.
- Liste des partenaires, filtrable par type (Salle / Studio / Coach
  indépendant / Espace bien-être), niveau d'accompagnement, statut de
  validation.
- Fiche Partenaire 360°, avec sous-fiches spécialisées **Fiche Coach** et
  **Fiche Lieu** (voir section 4 — correspond à l'écran "Lieux" côté
  partenaire : un partenaire peut gérer plusieurs emplacements).
- **Carte des partenaires** — vue géolocalisée (Dakar : Plateau, Almadies,
  Ngor, Mermoz, Sacré-Cœur, Point E, Ouakam, Yoff), miroir admin de
  l'exploration par quartier côté app Passionné.
- **File de validation** — activités et profils partenaires en attente de
  modération (assistée par Claude, décision humaine finale).
- **Demandes d'onboarding** — nouveaux partenaires en cours de qualification.
- **Équipes** (vue admin en lecture) — miroir de l'écran "Équipes" côté
  partenaire, pour que les CSM Partenaires voient qui gère chaque compte.
- **Finances partenaire** (vue admin en lecture) — miroir de l'écran
  "Finances"/retraits côté partenaire ; le détail transactionnel vit dans le
  module Wallet & Finance (voir plus bas).

### Entreprises QVT (comptes B2B)
- Liste des entreprises QVT, filtrable par secteur, taille, niveau
  d'accompagnement, date de renouvellement.
- Fiche Entreprise 360° *(livré en P0-1)*.
- **Portefeuille collaborateurs** — import Excel (template fourni), suivi
  ligne à ligne du taux d'activation, invitations automatiques aux
  non-inscrits.
- **Demandes QVT entrantes** — formulaire du site vitrine, à qualifier avant
  transformation en opportunité.

### Pipeline & Opportunités
- **Pipeline Partenaires** — vue kanban (voir workflow section 5).
- **Pipeline Entreprises QVT** — vue kanban (voir workflow section 5).
- **Liste des opportunités** — filtrable par étape, montant, propriétaire,
  échéance.
- Fiche Opportunité (voir section 4).
- **Prévisionnel de revenu** — forecast pondéré par probabilité d'étape.

### Marketing
- ✅ **Campagnes** *(livré en P0-4 — `/campagnes`, `/campagnes/[id]`)* — liste
  + détail avec suivi de performance par statut d'envoi (envoyé/livré/lu/
  cliqué/échec) et log des envois par compte.
- ✅ **Templates par segment/phase** *(livré en P0-4 — `/templates`)* —
  onboarding / adoption / expansion / crise, déclinés Passionnés /
  Partenaires / QVT. Réutilisés par les relances automatiques des playbooks
  P0-2 (`PlaybookEtape.templateId`).
- **Créateur de campagne** — pas encore construit (les campagnes de démo sont
  actuellement des données de mock, pas un formulaire de création).
- **Séquences d'automatisation** — connectées N8N (relances J+3/J+7, etc.) —
  point d'intégration documenté, N8N lui-même non branché.
- **Segmentation & audiences** — constructeur de segments réutilisables — pas
  construit (le ciblage actuel se limite à segment + phase sur `Campagne`).

### Support
- ✅ **File de tickets** *(livré en P0-5 — `/tickets`)* — priorité, SLA
  restant (calculé, pas stocké), canal d'entrée, origine (manuel vs
  auto-création agent vocal), triée par urgence SLA.
- ✅ Fiche Ticket *(livré en P0-5 — `/tickets/[id]`)* — échéances SLA, CSAT à
  la clôture (section 4).
- **Base de connaissance / FAQ** — back-office du contenu self-service (blog,
  FAQ, vidéos, guides PDF onboarding QVT) — pas construit.
- **Performance agent vocal** — taux de résolution RVI (cible 80 %), taux
  d'escalade, temps de traitement (ElevenLabs) — pas construit (dashboard #14).
- **CSAT & verbatims** — le score/commentaire existent sur `Ticket`, pas
  encore agrégés dans une vue dédiée.

### Partenaires *(volet financier, distinct du module Comptes Partenaires)*
> Regroupé avec Wallet & Finance ci-dessous pour éviter la redondance avec le
> module "Partenaires" de la section Comptes — les écrans financiers
> partenaires (retraits, historique paiements) vivent dans Wallet & Finance
> et sont aussi accessibles depuis la Fiche Partenaire.

### Wallet & Finance
- **Vue crédits globale** — achetés / consommés / dormants, par segment,
  avec suivi du double-crédit (B2C, Corporate, offert — expiration 1 mois,
  non transférable). Pricing confirmé en test : pack 5 crédits = 5 000 XOF,
  pack 20 crédits = 20 000 XOF.
- **Transactions & paiements** — Wave, Orange Money, carte bancaire ; suivi
  des erreurs de paiement.
- **Retraits partenaires** — demandes, statut KYC/KYB, exécution.
- **Facturation B2B QVT** — factures mensuelles centralisées, échéances.
- **Commissions Cuberfit** — 10-15 % crédits utilisés, 15-25 % crédits
  dormants, 1-2 % frais de gestion QVT, marge par segment.

### Reporting & Analytics
- ✅ **Score de risque & Churn** *(livré en P0-3 — `/score-de-risque`)* —
  c'est le dashboard #1 de la section 6 déjà construit : répartition
  vert/orange/rouge globale + par segment, liste des comptes à risque
  immédiat.
- **Centre de dashboards** — accès unifié aux 19 autres dashboards (section
  6) — pas construit, chaque dashboard futur sera un écran séparé comme
  `/score-de-risque`.
- **Rapports personnalisés** — constructeur de rapport + export (CSV/PDF) —
  pas construit.
- **Rapports QVT automatisés** — un PDF par entreprise, envoi périodique DRH
  — pas construit.

### Administration
- **Rôles & permissions** — Admin, CSM Entreprises, CSM Partenaires, CS
  Ops/Support, Sales/BizDev, Lecture seule (+ rôles partenaires côté app).
- **Validation** — activités et profils partenaires (modération assistée IA).
- **Conformité** — KYC/KYB partenaires, procédure paiement, charte qualité.
- **Catalogue produit** — activités, formules (séance/pack/abonnement),
  capacité par créneau.
- **Contenu** — blog, FAQ, charte qualité, avis vérifiés.

### Paramètres
- ✅ **Score de risque** *(livré en P0-3 — `/parametres/score-de-risque`)* —
  pondérations ajustables par segment, sans redéploiement. Validation en
  temps réel (chaque segment doit totaliser 100 %). Pas encore persistées
  (pas de base de données branchée) — l'écran le signale explicitement.
- **Templates de communication** — bibliothèque email/SMS/WhatsApp — la liste
  existe (`/templates`, voir Marketing) ; l'édition depuis Paramètres n'est
  pas construite.
- **Intégrations** — ElevenLabs, WhatsApp Business (LAM), N8N, Amplitude,
  Claude (modération), Wave/Orange Money — points d'intégration documentés,
  aucun écran de configuration construit.
- **Règles d'automatisation (if/then)** — SLA, escalade, playbooks de crise —
  modélisées dans le schéma (`Playbook`/`PlaybookEtape`), pas d'écran
  d'édition dédié (les playbooks de démo sont des données de mock).
- **Marchés & devises** — prépare l'extension Côte d'Ivoire / Maroc / Nigeria
  — pas construit.

---

## 3. Le socle commun de toute fiche

Chaque fiche listée en section 4 partage la même structure (façon Salesforce
Record Page / HubSpot Timeline / Intercom Inbox) :

| Composant | Rôle |
|---|---|
| **Timeline** | Fil chronologique unifié de tous les événements (achats, tickets, campagnes, appels agent vocal, changements Score de risque) — c'est la table `Interaction` du schéma P0-1. |
| **Documents** | Contrats, pièces KYC/KYB, exports de rapports, pièces jointes de tickets. |
| **Emails** | Historique des échanges email liés au compte, envoi direct depuis la fiche. |
| **WhatsApp** | Historique des conversations WhatsApp Business (LAM), envoi direct. |
| **Commentaires** | Notes internes de l'équipe CRM, non visibles du client. |
| **Historique** | Journal d'audit : qui a modifié quoi et quand (champ par champ). |
| **IA** | Résumé automatique de la fiche, suggestions d'action (ex: "risque de churn détecté"), réponses pré-rédigées. |
| **Actions** | Boutons contextuels propres à chaque type de fiche (voir tableau section 4). |
| **Tags** | Étiquettes libres pour segmentation ad hoc (ex: "compte stratégique", "à surveiller"). |
| **Relations** | Comptes/contacts/fiches liés (ex: un Coach lié à ses Passionnés suivis, une Entreprise liée à son Contrat). |

---

## 4. Toutes les fiches

| Fiche | Entité (schéma) | Champs spécifiques clés | Relations spécifiques | Actions spécifiques |
|---|---|---|---|---|
| **Fiche Entreprise** | `EntrepriseQvtProfile` *(P0-1)* | Secteur, effectif, budget alloué/consommé, % activés/actifs, date renouvellement | Contacts RH, Contrat, Opportunités, Collaborateurs (Passionnés liés), Tickets, Campagnes reçues | Générer rapport QVT, Renouveler contrat, Charger collaborateurs |
| **Fiche Contact** | `Contact` *(P0-1)* | Rôle (interlocuteur RH, gérant...), contact principal | Compte parent, emails/appels échangés | Définir comme contact principal, Envoyer email |
| **Fiche Utilisateur** | `PassionneProfile` *(P0-1)* | Crédits (achetés/consommés/dormants/offerts), statut abonnement, no-show/annulations | Coachs associés, réservations, historique Score de risque | Créditer/débiter crédits, Réinitialiser mot de passe, Suspendre le compte |
| **Fiche Coach** | `PartenaireProfile` (type = coach indépendant) | Disciplines, certifications, tarifs, taux de remplissage | Passionnés suivis (`CoachAssociation`), avis reçus | Valider certification, Booster la visibilité |
| **Fiche Lieu** *(écran réel : "Lieux")* | `PartenaireProfile` (type = salle/studio/espace bien-être) | Adresse, équipements, capacité par créneau, complétude profil | Activités proposées, équipe assignée *(écran réel : "Équipes")*, créneaux | Valider le profil, Gérer la capacité, Ajouter un membre à l'équipe |
| **Fiche Ticket** | ✅ `Ticket` *(livré en P0-5)* | Canal d'entrée, priorité, SLA restant (calculé), origine (manuel / auto agent vocal), CSAT | Compte, agent assigné | Escalader, Résoudre, Envoyer l'enquête CSAT *(actions non câblées — pas de backend)* |
| **Fiche Contrat** | `Contrat` *(à créer, P1)* | Type (Partenaire/QVT), montant, durée, date de signature/renouvellement | Compte, signataire, avenants | Renouveler, Résilier, Générer un avenant |
| **Fiche Opportunité** | `Opportunite` *(à créer, P1 Pipeline)* | Étape, montant, probabilité, date de clôture prévue | Compte, propriétaire (commercial), activités liées | Faire avancer l'étape, Créer une proposition |
| **Fiche Campagne** | ✅ `Campagne` *(livré en P0-4)* | Canal, segment/phase cible, statut, template, dates | Template utilisé, comptes touchés (`CampagneEnvoi`) | Lancer, Dupliquer, Voir la performance *(actions non câblées — pas de backend)* |
| **Fiche Commercial** | `UtilisateurCRM` (rôle Sales/BizDev ou CSM) | Portefeuille, quota, taux de conversion | Comptes gérés, opportunités en cours | Réaffecter le portefeuille — *à réconcilier avec les rôles réels Activation Manager / Account Manager (voir section 0)* |

**Entités techniques additionnelles déjà dans le schéma** (pas des "fiches"
avec leur propre écran principal, mais du modèle qui alimente les fiches
ci-dessus) : `Playbook` / `PlaybookEtape` / `PlaybookExecution` /
`MomentDeVerite` (P0-2, moteur des règles if/then), `PonderationRisqueScore`
(P0-3, poids du Score de risque), `TemplateCommunication` (P0-4, a son propre
écran liste `/templates`).

---

## 5. Tous les workflows

### 5.1 Pipeline Partenaires (acquisition)
```
Prospect → Qualification → Onboarding → Actif → Renouvellement / Churn
```
Onboarding = kick-off + configuration du profil + création des premières
activités (cf. Story Map). Le passage à "Actif" déclenche la création du
`PartenaireProfile` définitif.

> **À remplacer avant le P1** par le parcours réel, plus riche, trouvé dans le
> Vision Book — le métier de l'**Activation Manager** :
> ```
> Découverte (visite terrain) → Diagnostic → Démonstration (live) →
> Engagement (conditions transparentes) → Onboarding (30 premiers jours,
> joignable en permanence) → Suivi actif (retour toutes les 2-4 semaines) →
> Ambassadeur (référencement de nouveaux partenaires)
> ```
> Ce cycle est spécifique et documenté (qui fait quoi à chaque étape) — voir
> `Cuberfit_Access_PRD.docx` section 14 et la mémoire projet
> `project-cuberfit-vision-ai-strategy`.

### 5.2 Pipeline Entreprises QVT (signature)
```
Prospect → RDV DRH → Démo → Proposition → Signature → Onboarding → Adoption → Renouvellement (J-90)
```
Onboarding = réunion DRH + kit de communication + webinaire employés +
invitations automatiques aux non-inscrits.

### 5.3 Lifecycle Passionné *(déjà cadré en P0-2)*
```
Inscription → Onboarding (relances J+3/J+7) → Adoption → Expansion (upsell/parrainage) → À risque → Churn / Réactivation
```

### 5.4 Ticket support *(cadré en P0-5)*
```
Canal d'entrée (app/WhatsApp/email/téléphone/RVI)
  → Tri automatique (intention + priorité)
  → Résolution RVI (cible 80 %) OU création ticket auto (20 % restants)
  → Assignation (selon segment + niveau d'accompagnement)
  → Suivi SLA → Résolution → CSAT
```

### 5.5 Score de risque → Action *(cadré en P0-3)*
```
Recalcul périodique → Statut Vert/Orange/Rouge
  Vert   → Fidéliser, proposer upsell
  Orange → Contact préventif sous 7 jours
  Rouge  → Action immédiate + notification CSM
```
Chaque recalcul écrit un `RisqueScoreSnapshot` et une entrée `Interaction`
(type `RISQUE_SCORE_CHANGE`), déjà prévus dans le schéma P0-1.

### 5.6 Escalade agent vocal → ticket *(cadré dans le prompt source, module D)*
```
Appel/message agent vocal → Détection d'intention
  Urgence / donnée sensible (Bloom) / insatisfaction → Escalade humaine automatique
  → Création d'un ticket priorisé (garde-fou : jamais stocker de donnée de santé hors du strict nécessaire)
```

### 5.7 Playbooks de crise *(cadré en P0-2)*
- **Client silencieux** → relance automatique si inactivité > X jours.
- **Client à risque** → déclenché par usage en baisse + réclamation.
- **Crise technique** → assignation à une équipe dédiée.
- **Sauvetage partenariat** → actions ciblées vers un partenaire insatisfait.

### 5.8 Onboarding collaborateurs QVT
```
Import Excel → Invitations auto aux non-inscrits → Suivi du taux d'activation → Alerte DRH si sous le seuil
```

### 5.9 Retrait partenaire
```
Demande de retrait → Vérification KYC/KYB → Validation admin → Exécution paiement (Wave/Orange Money) → Notification
```

### 5.10 Validation d'activité partenaire
```
Brouillon créé par le partenaire → Modération assistée IA (Claude) → Décision admin (validation/refus) → Publication
```

---

## 6. Les 20 dashboards

| # | Dashboard | Public | Objectif | Métriques clés |
|---|---|---|---|---|
| 1 | **Direction / Exécutif** | Harouna, Awa | Vue CEO globale | MRR, croissance MoM, comptes à risque, KPIs de lancement vs cible |
| 2 | **Commercial** | Sales/BizDev | Piloter le pipeline | Opportunités par étape, taux de conversion, forecast |
| 3 | **Marketing** | Marketing | Performance des campagnes | Taux d'ouverture/clic par canal, ROI campagne |
| 4 | **Support** | Fatou + équipe | Qualité de service | Volume tickets, SLA respecté %, temps moyen résolution |
| 5 | **Finance** | Awa | Revenus & commissions | Revenus par segment, commissions perçues, marge |
| 6 | **Corporate / QVT** | CSM Entreprises | Portefeuille QVT | % activation, % actifs mensuels, budget consommé, renouvellements à venir |
| 7 | **Partenaires** | CSM Partenaires | Santé du réseau partenaire | Taux de remplissage moyen, partenaires actifs, satisfaction |
| 8 | **Wallet & Crédits** | Finance, Admin | Suivi du système de crédits | Crédits achetés/consommés/dormants, répartition B2C/Corporate/offert |
| 9 | **Utilisateurs / Passionnés** | CS Ops | Comportement B2C | Activation, fréquence d'usage, no-show |
| 10 | **Croissance** | Direction, Growth | Funnel d'acquisition | AARRR (acquisition, activation, rétention, referral, revenu) |
| 11 | **NPS & Satisfaction** | CS, Direction | Satisfaction par segment | NPS par segment, verbatims, évolution |
| 12 | **SLA & Qualité de service** | Support | Respect des engagements | 1ère réponse <4h, résolution 24-48h, taux de dépassement |
| 13 | **Amplitude (produit)** | Growth, Data | Usage in-app | Funnels, rétention comportementale, événements clés (sync Amplitude) |
| 14 | **IA & Automatisation** | Admin, CS | Performance des agents automatisés | Taux de résolution RVI (cible 80 %), taux d'escalade, actions de modération Claude |
| 15 | ✅ **Score de risque & Churn** *(livré — `/score-de-risque`)* | CS, CSM | Prévention du churn | Répartition vert/orange/rouge, comptes passés en rouge cette semaine |
| 16 | **Onboarding & Activation** | CS Ops, CSM | Suivi des moments de vérité | 1ère session réussie, 1ère réservation, 1er reporting QVT positif |
| 17 | **Campagnes & Communication** | Marketing | Performance multicanale | Volume envoyé/livré/lu par canal (email/SMS/WhatsApp) |
| 18 | **Compliance & KYC/KYB** | Admin, Awa | Conformité | Partenaires en attente de vérification, incidents de conformité, statut Bloom |
| 19 | **Catalogue & Offre** | Admin, CSM Partenaires | Santé de l'offre | Nombre d'activités actives, taux de remplissage global, zones sous-couvertes |
| 20 | **Cohortes & Rétention** | Growth, Direction | Valeur dans le temps | Rétention par cohorte d'inscription, LTV par segment |

---

## 7. Ce qu'il reste à trancher avant de continuer sur le P1

1. ✅ **Charte visuelle** — résolu : couleurs primaire/secondaire et
   typographie confirmées (voir section 0). Reste seulement l'encre foncée et
   l'accent orange en hex exact, si un rendu pixel-perfect devient nécessaire.
2. ✅ **P0 complet livré** — P0-1 à P0-5 sont construits et mergés sur `main`
   (PRs #1 à #7). Ce document reste la **carte d'ensemble** pour le P1
   (Pipeline Partenaires, Analytics avancé, NPS & feedback, Administration) —
   même règle de séquencement module par module à appliquer au P1.
3. **Entités encore à créer** — `Contrat` et `Opportunite` (P1 Pipeline).
   `Ticket` et `Campagne` sont livrés (voir section 4).
4. **Relecture** — vu le bruit OCR des documents sources, une relecture rapide
   des chiffres/KPIs cités en section 0 reste utile avant de les considérer
   comme définitifs pour calibrer les 19 dashboards restants.
5. ✅ **Terminologie alignée sur le produit réel** — résolu : "Lieux" et
   "Équipes" corrigés dans ce document après navigation sur l'environnement
   de test (2026-07-07).
6. **Réconciliation de l'organisation CX** — le Vision Book définit des rôles
   plus riches que ceux de ce document (Activation Manager côté Partenaires,
   Account Manager côté Corporate post-signature) — voir section 0 et
   section 5.1. À trancher avant de construire la Fiche Commercial et le
   Pipeline P1 : garder les rôles CRM génériques actuels, ou les remplacer
   par cette organisation réelle ?
7. **Aucune donnée n'est persistée** — tous les modules livrés (P0-1 à P0-5)
   tournent sur des données mock en mémoire, pas de base Postgres branchée.
   C'est le prochain choix structurant avant le P1 : brancher une vraie base
   maintenant, ou continuer à itérer sur le mock jusqu'à ce que le P1 soit
   également maquetté.
