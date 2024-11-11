const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.object({
      filename: Joi.string().default("listingimage"),
      url: Joi.string()
        .uri()
        .allow('', null)  // Allow empty string and null for url
        .default("https://www.pexels.com/search/beautiful%20nature/"), // Set default URL
    }).optional(),
  }).required(),
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});