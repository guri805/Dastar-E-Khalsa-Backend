const Participant = require("../Model/ParticipantModel");
const Counter = require("../Model/CounterModel");
const Subcategory = require("../Model/SubcategoryModel");
const Category = require("../Model/CategoryModel");

const participantData = async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const { fullName, age, gender, fatherName, address, hometown, whatsappNumber, email, schoolOrCollege, categoryId, subcategoryId, competition, group } = req.body;

        if (!categoryId || !subcategoryId) {
            return res.status(400).json({ success: false, message: "Category and subcategory are required" });
        }

        // Find Category and Subcategory
        const CategoryGroup = await Category.findById(categoryId);
        if (!CategoryGroup) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const subcategoriesGroup = await Subcategory.findById(subcategoryId);
        if (!subcategoriesGroup) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        // **Check Gender Restriction for Turban**
        if (gender === "Female" && CategoryGroup.name.toLowerCase() === "turban") {
            return res.status(400).json({ success: false, message: "Females cannot register for the Turban category" });
        }

        // **Check Age Restrictions for Subcategories**
        const subcategoryGroup = subcategoriesGroup.group.toLowerCase();

        if ((age >= 5 && age <= 15) && (subcategoryGroup === "senior" || subcategoryGroup === "expert")) {
            return res.status(400).json({ success: false, message: "Participants aged 5-15 are not eligible for Senior and Expert groups" });
        }

        if (age >= 16 && subcategoryGroup === "junior") {
            return res.status(400).json({ success: false, message: "Participants aged 15+ are not eligible for Junior group" });
        }

        // Extract first letters for participant ID
        const firstLetterOfCategory = CategoryGroup.name.charAt(0).toUpperCase();
        const firstLetterOfSubcategory = subcategoriesGroup.group.charAt(0).toUpperCase();

        // Manage Counter
        let counter = await Counter.findOne({ categoryId, subcategoryId });

        if (!counter) {
            counter = new Counter({ categoryId, subcategoryId, count: 1 });
        } else {
            counter.count++;
        }

        // Generate participant ID
        const participantId = counter.count + firstLetterOfCategory + firstLetterOfSubcategory;

        // Create participant entry
        const newParticipant = new Participant({
            // _id: participantId,
            tokenNumber: participantId,
            fullName,
            age,
            gender,
            fatherName,
            address,
            hometown,
            whatsappNumber,
            email,
            schoolOrCollege,
            competition,
            group,
            categoryId,
            subcategoryId,
        });

        await newParticipant.save();
        await counter.save();

        res.status(201).json({ success: true, message: "Participant registered successfully",  participant: newParticipant });

    } catch (error) {
        console.error("Error registering participant:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get All Participants
const allParticipantDetails = async (req, res) => {
    try {
        const participants = await Participant.find();
        res.status(200).json(participants);
    } catch (error) {
        console.error("Error fetching participants:", error);
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
};
// API to fetch participant details by ID
const participantDetailsById = async (req, res) => {
    try {
        const participant = await Participant.findById(req.params.id).populate('categoryId subcategoryId');
        if (!participant) {
            return res.status(404).json({ success: false, message: 'Participant not found' });
        }
        res.status(200).json(participant);
    } catch (error) {
        console.error('Error fetching participant details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Filter Participants
const filterParticipantsByCompetition = async (req, res) => {
    const { competition, group } = req.body;
    try {
        let query = {};
        if (competition) query.competition = competition;
        if (group) query.group = group;

        const participants = await Participant.find(query);
        res.json(participants);
    } catch (error) {
        console.error("Error fetching participants:", error);
        res.status(500).json({ message: "An error occurred while fetching participants." });
    }
};

module.exports = { participantData, allParticipantDetails, filterParticipantsByCompetition, participantDetailsById };
