const Participant = require("../Model/ParticipantModel");
const Counter = require("../Model/CounterModel");
const Subcategory = require("../Model/SubcategoryModel")
const Category = require("../Model/CategoryModel")

const participantData = async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging step

        const { fullName, age, gender, fatherName, address, hometown, whatsappNumber, email, schoolOrCollege, categoryId, subcategoryId } = req.body;

        if (!categoryId || !subcategoryId) {
            return res.status(400).json({ success: false, message: "Category and subcategory are required" });
        }

        // Find the Category by its Id to get the "name" field
        const CategoryGroup = await Category.findById(categoryId);
        if (!CategoryGroup) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        const firstLetterOfCategory = CategoryGroup.name.charAt(0).toUpperCase();

        // Find the subcategory by its ID to get the 'group' field
        const subcategoriesGroup = await Subcategory.findById(subcategoryId);
        if (!subcategoriesGroup) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        // Extract the first letter of the 'group' field (e.g., "Junior", "Senior", "Expert")
        const firstLetterOfSubcategory = subcategoriesGroup.group.charAt(0).toUpperCase();

        // Find the counter for the given category and subcategory
        let counter = await Counter.findOne({ categoryId: categoryId, subcategoryId: subcategoryId });

        if (!counter) {
            // If counter does not exist, create a new one with count 1
            counter = new Counter({
                categoryId: categoryId,
                subcategoryId: subcategoryId,
                count: 1
            });
        } else {
            // If counter exists, increment the count
            counter.count += 1;
        }

        // Create the participant ID by combining the counter and the first letter of the subcategory
        const participantId = counter.count + firstLetterOfCategory + firstLetterOfSubcategory;

        // Create the new participant with the assigned ID
        const newParticipant = new Participant({
            _id: participantId, // Assign the custom participant ID
            fullName,
            age,
            gender,
            fatherName,
            address,
            hometown,
            whatsappNumber,
            email,
            schoolOrCollege,
            categoryId,
            subcategoryId,
            // tokenNumber: participantId,
        });

        // Save the new participant first
        await newParticipant.save();

        // After successfully saving the participant, update the counter
        await counter.save();

        res.status(201).json({ success: true, message: "Participant registered successfully", participantId });
    } catch (error) {
        console.log("Error registering participant:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Get All Participants
const participantDetails = async (req, res) => {
    try {
        const participants = await Participant.find();
        res.status(200).json(participants);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};

// Function to filter participants by competition
const filterParticipantsByCompetition = async (req, res) => {
    const { competition, group } = req.body; // Getting data from req.body

    try {
        let query = {};

        if (competition) {
            query.competition = competition;  // Filter by competition if provided
        }

        if (group) {
            query.group = group;  // Filter by group if provided
        }

        const participants = await Participant.find(query);
        res.json(participants);  // Send the filtered participants
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'An error occurred while fetching participants.' });
    }
}

module.exports = { participantData, participantDetails, filterParticipantsByCompetition };
