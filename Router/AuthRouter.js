const express = require('express');
const { participantData, allParticipantDetails, filterParticipantsByCompetition, participantDetailsById } = require('../Controller/ParticipantController');
const { fetehCategory, fetchSubcategory, CreateCategory, CreateSubCategory } = require('../Controller/CategoryController');
const validateMiddleware = require('../Middleware/ValidateMiddleware');
const participantValidationSchema = require('../validation/ParticipationValidation');
const router = express.Router()

// category 
router.post("/category", CreateCategory)
router.get("/categories", fetehCategory)

// subcategory
router.post("/subcategory", CreateSubCategory)
router.get("/subcategories/:categoryId", fetchSubcategory)

// participant 
router.post("/participantdata", validateMiddleware(participantValidationSchema), participantData)
router.get("/participantdetails", allParticipantDetails)
router.get("/participantdetails/:id",participantDetailsById)
router.post("/api/participants", filterParticipantsByCompetition);

module.exports = router;