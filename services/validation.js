const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const postMatiereValidation = (data) => {
  const schema = Joi.object({
    nommatiere: Joi.string().min(6).max(1024).required(),
    coeffmatiere: Joi.number().min(1).max(3).required(),
    matiereimg: Joi.string().min(6).max(1024),
    profmatiere: Joi.objectId().required(),
  });
  return schema.validate(data);
};

const postAssignmentValidation = (data) => {
  const schema = Joi.object({
    rendu: Joi.boolean().default(false),
    dateDeRendu: Joi.date().iso().required(),
    renduLe: Joi.date().iso(),
    note: Joi.number().min(0).max(20),
    remarque: Joi.string().min(0).max(1024),
    matiere: Joi.objectId().required(),
    eleve: Joi.objectId().required(),
    prof: Joi.objectId().required(),
  });
  return schema.validate(data);
};

const registerValidation = (data) => {
  const schema = Joi.object({
    nomuutilisateur: Joi.string().min(2).max(255).required(),
    prenomutilisateur: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    role: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

module.exports = {
  postMatiereValidation,
  postAssignmentValidation,
  registerValidation,
  loginValidation,
};
