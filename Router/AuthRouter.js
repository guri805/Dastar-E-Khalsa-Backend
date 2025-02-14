const express = require('express');
const {participantData, participantDetails, filterParticipantsByCompetition} = require('../Controller/ParticipantController');
const {fetehCategory, fetchSubcategory, CreateCategory, CreateSubCategory} = require('../Controller/CategoryController');
const router = express.Router()

// category 
router.post("/category",CreateCategory)
router.get("/categories",fetehCategory)
// subcategory
router.post("/subcategory",CreateSubCategory)
router.get("/subcategories/:categoryId",fetchSubcategory)
// participant 
router.post("/particantdata", participantData)
router.get("/participantdetails",participantDetails)
router.post("/api/participants", filterParticipantsByCompetition);

module.exports = router;