import express from "express"; // Importer le module express pour créer le routeur
import { success } from "./helper.mjs"; // Importer la fonction success pour formater les réponses
import { auth } from "../auth/auth.mjs"; // Importer le middleware d'authentification (non utilisé ici)
import { sequelize } from "../db/sequelize.mjs"; // Importer l'instance de Sequelize pour la connexion à la DB
import { Sequelize, Op, DataTypes } from "sequelize"; // Importer Sequelize, les opérateurs et DataTypes

// Importer les fonctions modèles depuis le module de définition des modèles
import { AuteurModel, CategorieModel, UtilisateurModel, EditeurModel, LivreModel } from "../db/sequelize.mjs";
import { LaisserModel, ApprecierModel, defineRelations } from "../models/structure.mjs";

const livreRouter = express.Router(); // Créer un routeur express dédié aux routes liées aux livres

// Initialisation des modèles en appelant les fonctions modèles avec sequelize et DataTypes
const Auteur = AuteurModel(sequelize, DataTypes); // Initialiser le modèle Auteur
const Categorie = CategorieModel(sequelize, DataTypes); // Initialiser le modèle Catégorie
const Utilisateur = UtilisateurModel(sequelize, DataTypes); // Initialiser le modèle Utilisateur
const Editeur = EditeurModel(sequelize, DataTypes); // Initialiser le modèle Editeur
const Livre = LivreModel(sequelize, DataTypes); // Initialiser le modèle Livre
const Laisser = LaisserModel(sequelize, DataTypes); // Initialiser le modèle Laisser (commentaires)
const Apprecier = ApprecierModel(sequelize, DataTypes); // Initialiser le modèle Apprecier (notations)

// Définir les relations entre les modèles en passant un objet contenant tous les modèles initialisés
defineRelations({
  Auteur,
  Categorie,
  Utilisateur,
  Editeur,
  Livre,
  Laisser,
  Apprecier
});
// Route GET pour récupérer tous les livres
livreRouter.get("/", async (req, res) => {
  try {
    // Rechercher tous les livres en incluant les associations Auteur et Catégorie
    const books = await Livre.findAll({
      include: [
        { model: Auteur },
        { model: Categorie }
      ]
    });

    // Si aucun livre n'est trouvé, retourner une réponse 404
    if (books.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé." });
    }

    // Retourner la liste des livres avec un message de succès
    return res.json(success("Liste des livres récupérée avec succès.", books));
  } catch (error) {
    // En cas d'erreur, l'afficher dans la console et retourner une réponse 500 avec le message d'erreur
    console.error("Erreur lors de la récupération des livres :", error);
    return res.status(500).json({ 
      message: "Impossible de récupérer les livres.",
      data: error.message
    });
  }
});

// Route GET pour récupérer un livre spécifique par ID
livreRouter.get("/:id", async (req, res) => {
  try {
    // Convertir l'ID reçu en entier
    const id = parseInt(req.params.id, 10);
    // Rechercher le livre par clé primaire en incluant les associations Auteur et Catégorie (non obligatoires)
    const book = await Livre.findByPk(id, {
      include: [
        { model: Auteur, required: false },
        { model: Categorie, required: false }
      ]
    });

    // Si le livre n'est pas trouvé, retourner une réponse 404
    if (!book) {
      return res.status(404).json({ message: "Le livre demandé n'existe pas." });
    }

    // Retourner le livre trouvé avec un message de succès
    return res.json(success(`Le livre dont l'id vaut ${id} a bien été récupéré.`, book));
  } catch (error) {
    // En cas d'erreur, l'afficher dans la console et retourner une réponse 500 avec le message d'erreur
    console.error("Erreur lors de la récupération du livre :", error);
    return res.status(500).json({ 
      message: "Le livre n'a pas pu être récupéré.",
      data: error.message 
    });
  }
});

// Route POST pour ajouter un nouveau livre
livreRouter.post("/", async (req, res) => {
  // Extraire les données du corps de la requête
  const { titre, auteur, categorie, anneeEdition, nbPage, imageCouverturePath, lien, resume } = req.body;

  try {
    // Vérifier si l'auteur existe dans la base, sinon le créer avec un prénom par défaut "Inconnu"
    let auteurData = await Auteur.findOne({ where: { nom: auteur } });
    if (!auteurData) {
      auteurData = await Auteur.create({ nom: auteur, prenom: "Inconnu" });
    }

    // Vérifier si la catégorie existe dans la base, sinon la créer
    let categorieData = await Categorie.findOne({ where: { libelle: categorie } });
    if (!categorieData) {
      categorieData = await Categorie.create({ libelle: categorie });
    }

    // Rechercher un livre similaire existant en fonction du titre et des associations auteur et catégorie
    const existingBooks = await Livre.findAll({
      where: {
        titre: { [Op.like]: `%${titre}%` },
        // Utiliser les clés étrangères définies dans la relation
        auteur_fk: auteurData.auteur_id,
        categorie_fk: categorieData.categorie_id
      }
    });

    // Si des livres similaires sont trouvés, retourner ces livres
    if (existingBooks.length > 0) {
      return res.json(success("Voici les livres correspondant à votre recherche :", existingBooks));
    }

    // Créer le nouveau livre avec les données fournies et les clés étrangères appropriées
    const book = await Livre.create({
      titre,
      auteur_fk: auteurData.auteur_id,
      categorie_fk: categorieData.categorie_id,
      anneeEdition,
      nbPage,
      imageCouverturePath,
      lien,
      resume
    });

    // Retourner le livre créé avec un message de succès
    return res.json(success(`Le livre "${book.titre}" a bien été créé.`, book));
  } catch (error) {
    // En cas d'erreur lors de la création, l'afficher dans la console et retourner une réponse 500 avec le message d'erreur
    console.error("Erreur lors de la création du livre :", error);
    return res.status(500).json({ 
      message: "Le livre n'a pas pu être ajouté.", 
      data: error.message 
    });
  }
});

// Route PUT pour modifier un livre par ID
livreRouter.put("/:id", async (req, res) => {
  const bookId = req.params.id; // Récupérer l'ID du livre à modifier depuis l'URL

  try {
    // Vérifier si le livre existe dans la base en utilisant sa clé primaire
    const book = await Livre.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Le livre demandé n'existe pas." });
    }

    // Si le corps de la requête contient le champ "auteur", gérer la mise à jour de l'association auteur
    if (req.body.auteur) {
      let auteurData = await Auteur.findOne({ where: { nom: req.body.auteur } });
      if (!auteurData) {
        // Créer l'auteur si non existant, avec le prénom par défaut "Inconnu"
        auteurData = await Auteur.create({ nom: req.body.auteur, prenom: "Inconnu" });
      }
      req.body.auteur_fk = auteurData.auteur_id; // Ajouter la clé étrangère correspondant à l'auteur trouvé ou créé
      delete req.body.auteur; // Supprimer le champ auteur pour éviter toute confusion
    }

    // Si le corps de la requête contient le champ "categorie", gérer la mise à jour de l'association catégorie
    if (req.body.categorie) {
      let categorieData = await Categorie.findOne({ where: { libelle: req.body.categorie } });
      if (!categorieData) {
        // Créer la catégorie si non existante
        categorieData = await Categorie.create({ libelle: req.body.categorie });
      }
      req.body.categorie_fk = categorieData.categorie_id; // Ajouter la clé étrangère correspondant à la catégorie trouvée ou créée
      delete req.body.categorie; // Supprimer le champ categorie pour éviter toute confusion
    }

    // Mettre à jour le livre avec les données modifiées du corps de la requête
    await Livre.update(req.body, { where: { livre_id: bookId } });

    // Récupérer le livre mis à jour avec ses associations (Auteur et Catégorie)
    const updatedBook = await Livre.findByPk(bookId, {
      include: [
        { model: Auteur, required: false },
        { model: Categorie, required: false }
      ]
    });

    // Retourner le livre mis à jour avec un message de succès
    return res.json(success(`Le livre "${updatedBook.titre}" a été mis à jour avec succès.`, updatedBook));
  } catch (error) {
    // En cas d'erreur lors de la mise à jour, l'afficher dans la console et retourner une réponse 500 avec le message d'erreur
    console.error("Erreur lors de la mise à jour du livre :", error);
    return res.status(500).json({ message: "Le livre n'a pas pu être mis à jour.", data: error.message });
  }
});

// Route DELETE pour supprimer un livre par ID
livreRouter.delete("/:id", async (req, res) => {
  try {
    // Rechercher le livre à supprimer par sa clé primaire
    const book = await Livre.findByPk(req.params.id);

    // Si le livre n'existe pas, retourner une réponse 404
    if (!book) {
      return res.status(404).json({ message: "Le livre demandé n'existe pas." });
    }

    // Supprimer le livre en utilisant sa clé primaire
    await Livre.destroy({ where: { livre_id: req.params.id } });

    // Retourner une réponse de succès avec le livre supprimé
    return res.json(success(`Le livre "${book.titre}" a bien été supprimé !`, book));
  } catch (error) {
    // En cas d'erreur lors de la suppression, retourner une réponse 500 avec le message d'erreur
    return res.status(500).json({ message: "Le livre n'a pas pu être supprimé.", data: error });
  }
});



/////////////////////////////////// ROUTES COMMENT //////////////////////////////////////

livreRouter.post("/:id/comments", async (req, res) => {
  const { contenu, utilisateur_id } = req.body;

  if (!contenu || !utilisateur_id) {
    return res.status(400).json({ message: "Le contenu et l'utilisateur_id sont nécessaires." });
  }

  try {
    const livreId = parseInt(req.params.id, 10);
    const book = await Livre.findByPk(livreId);
    if (!book) {
      return res.status(404).json({ message: "Le livre demandé n'existe pas." });
    }

    const newComment = await Laisser.create({
      livre_fk: livreId,
      utilisateur_fk: utilisateur_id,
      contenu: contenu
    });

    return res.status(201).json({
      message: "Commentaire ajouté avec succès.",
      comment: newComment
    });
  } catch (error) {
    return res.status(500).json({
      message: "Le commentaire n'a pas pu être ajouté.",
      error: error.message
    });
  }
});

livreRouter.get("/:id/comments", async (req, res) => {
  const livreId = parseInt(req.params.id, 10);

  try {
    const book = await Livre.findByPk(livreId);
    if (!book) {
      return res.status(404).json({ message: "Le livre demandé n'existe pas." });
    }

    const comments = await Laisser.findAll({
      where: { livre_fk: livreId },
      include: [
        {
          model: Utilisateur,
          attributes: ["username"],
        },
      ],
    });

    if (comments.length === 0) {
      return res.status(404).json({ message: "Aucun commentaire trouvé pour ce livre." });
    }

    return res.status(200).json({
      message: `Commentaires pour le livre avec l'ID ${livreId}`,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des commentaires.",
      error: error.message,
    });
  }
});


////////////////////////////////// ROUTES NOTES //////////////////////////////////////
livreRouter.get("/:id/notes", async (req, res) => {
  const livreId = parseInt(req.params.id, 10);

  try {
    const book = await Livre.findByPk(livreId);
    if (!book) {
      return res.status(404).json({ message: "Le livre demandé n'existe pas." });
    }

    const ratings = await Apprecier.findAll({
      where: { livre_fk: livreId },
      include: [
        {
          model: Utilisateur,
          attributes: ["username"],
        },
      ],
    });

    if (ratings.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour ce livre." });
    }

    return res.status(200).json({
      message: `Notes pour le livre avec l'ID ${livreId}`,
      ratings,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des notes.",
      error: error.message,
    });
  }
});
livreRouter.post("/:id/notes", async (req, res) => {
  const { note, utilisateur_id, livre_id } = req.body;

  if (note === undefined || utilisateur_id === undefined || livre_id === undefined) {
    return res.status(400).json({ message: "La note, utilisateur_id et livre_id sont nécessaires." });
  }

  try {
    const book = await Livre.findByPk(livre_id);
    if (!book) {
      return res.status(404).json({ message: "Le livre demandé n'existe pas." });
    }

    const user = await Utilisateur.findByPk(utilisateur_id);
    if (!user) {
      return res.status(400).json({ message: "L'utilisateur spécifié n'existe pas." });
    }

    const newRating = await Apprecier.create({
      livre_fk: livre_id,
      utilisateur_fk: utilisateur_id,
      note: note
    });

    return res.status(201).json({
      message: "Note ajoutée avec succès.",
      rating: newRating
    });
  } catch (error) {
    return res.status(500).json({
      message: "La note n'a pas pu être ajoutée.",
      error: error.message
    });
  }
});



export { livreRouter }; // Exporter le routeur pour qu'il soit utilisé dans l'application principale
