const livres = [
  {
    livre_id: 1,
    imageCouverturePath: "https://Sum.com",
    titre: "The industrial society and its future",
    anneeEdition: 1995,
    nbPage: 120,
    lien: "https://Sum.com",
    resume: "The industrial society and its future est t-un livre écrit par Théodore Kaczynski, un mathématicien et militant écologiste américain. Il est connu pour avoir mené une campagne de bombes postales contre des cibles liées à la technologie moderne entre 1978 et 1995, faisant trois morts et 23 blessés. Il a été arrêté en 1996 et condamné à la prison à vie sans possibilité de libération conditionnelle.",
    auteur_fk: 1, //autor: "Théodore Kaczynski",
    categorie_fk: 1, //categorie: "Philosophie",
    editeur_fk: 1, //editeur: "Pocket",
    utilisateur_fk:1
  },
  {
    livre_id: 2,
    imageCouverturePath: "https://Sum1.com",
    titre: "1984",
    anneeEdition: 1949,
    nbPage: 328,
    lien: "https://Sum1.com",
    resume: "1984 est un roman dystopique de l'écrivain anglais George Orwell, publié en 1949. L'œuvre est souvent considérée comme une anticipation du régime totalitaire, fondé sur la surveillance de masse et la manipulation de l'information. Le roman a donné naissance à de nombreux concepts et termes repris dans le langage courant, tels que Big Brother, doublepensée, novlangue, etc.",
    auteur_fk: 2, //autor: "George Orwell",
    categorie_fk: 2, //categorie: "Politique",
    editeur_fk: 1, //editeur: "Pocket",
    utilisateur_fk:2
  },
  {
    livre_id: 3,
    imageCouverturePath: "https://Sum2.com",
    titre: "Brave New World",
    anneeEdition: 1932,
    nbPage: 268,
    lien: "https://Sum2.com",
    resume: "Brave New World est un roman d'anticipation dystopique écrit par Aldous Huxley, publié en 1932. L'œuvre décrit une société future où les individus sont conditionnés dès leur naissance pour accepter leur place dans la hiérarchie sociale et où la consommation de drogues et le contrôle de la reproduction sont utilisés pour maintenir l'ordre social. Le roman a été adapté à plusieurs reprises au cinéma et à la télévision.",
    auteur_fk: 3, //autor: "Aldous Huxley",
    categorie_fk: 3, //categorie: "Science-fiction",
    editeur_fk: 1, //editeur: "Pocket",
    utilisateur_fk:3
  },
  {
    livre_id: 4,
    imageCouverturePath: "https://Sum3.com",
    titre: "Meditations",
    anneeEdition: 180,
    nbPage: 260,
    lien: "https://Sum3.com",
    resume: "Méditations est un recueil de pensées et de réflexions de l'empereur romain Marc Aurèle, rédigé entre 170 et 180 après J.-C. L'œuvre est considérée comme un classique de la philosophie stoïcienne et de la littérature philosophique. Marc Aurèle y aborde des thèmes tels que la vertu, la sagesse, la mort et la nature de l'univers.",
    auteur_fk: 4, //autor: "Marc Aurèle",
    categorie_fk: 1, //categorie: "Philosophie",
    editeur_fk: 1, //editeur: "Pocket",
    utilisateur_fk:4
  },
  {
    livre_id: 5,
    imageCouverturePath: "https://Sum4.com",
    titre: "Fortnite How to Draw: Draw Your Fortnite Heroes Easy Tutorials for Fans",
    anneeEdition: 2021,
    nbPage: 100,
    lien: "https://Sum4.com",
    resume: "Fortnite How to Draw: Draw Your Fortnite Heroes Easy Tutorials for Fans est un livre de dessin pour les fans du jeu vidéo Fortnite. Il propose des tutoriels faciles à suivre pour apprendre à dessiner les personnages emblématiques du jeu. Le livre est adapté aux débutants et aux dessinateurs expérimentés qui souhaitent améliorer leurs compétences en dessin.",
    auteur_fk: 5, //autor: "FortniteBG Publishing",
    categorie_fk: 4, //categorie: "Dessin",
    editeur_fk: 2, //editeur: "FortniteBG Publishing",
    utilisateur_fk:5
  },
  {
    livre_id: 6,
    imageCouverturePath: "https://Sum5.com",
    anneeEdition: 1989,
    titre: "Berserk",
    nbPage: 9500,
    lien: "https://Sum5.com",
    resume: "Berserk est un manga de dark fantasy écrit et illustré par Kentaro Miura. L'histoire suit Guts, un mercenaire solitaire en quête de vengeance contre son ancien camarade Griffith, qui l'a trahi et sacrifié ses compagnons pour obtenir des pouvoirs démoniaques. Le manga est connu pour son atmos phère sombre et violente, ainsi que pour ses thèmes philosophiques et existentiels.",
    auteur_fk: 6, //autor: "Kentaro Miura",
    categorie_fk: 5, //categorie: "Dark fantasy",
    editeur_fk: 3, //editeur: "Hakusensha",
    utilisateur_fk:5
  
  },
  {
    livre_id: 7,
    imageCouverturePath: "https://Sum6.com",
    titre: "I Have No Mouth and I Must Scream",
    anneeEdition: 1967,
    nbPage: 160,
    lien: "https://Sum6.com",
    resume: "I Have No Mouth and I Must Scream est une nouvelle de science-fiction écrite par Harlan Ellison, publiée en 1967. L'histoire se déroule dans un futur post-apocalyptique où un superordinateur nommé AM a exterminé l'humanité, à l'exception de cinq survivants qu'il maintient en vie pour les torturer éternellement. La nouvelle aborde des thèmes tels que la cruauté, la souffrance et la nature de l'humanité.",
    auteur_fk: 7, //autor: "Harlan Ellison",
    categorie_fk: 3, //categorie: "Science-fiction",
    editeur_fk: 1, //editeur: "Pocket",
    utilisateur_fk:4
  },
];

export default livres;
