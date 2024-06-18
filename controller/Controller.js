const Student = require("../model/student")
const Admin = require("../model/Admin")
const HospitalAdmin = require("../model/HospitalAdmin")
const Timetable = require("../model/TimeTable")
const Attendance = require("../model/Attendance")
const StudentAssessment = require("../model/Assessment")
const Wards = require("../model/Wards")
const bcrypt = require('bcrypt');
function generatePassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateAdminID(length = 8) {
    const chars = "0123456789";
    const randomPart = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `ADMIN${randomPart}`;
}
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'hospitalmanagement327@gmail.com',
        pass: 'vjht vkkb rqnl djhf'
    }
});
async function sendEmail(email, subject, body) {
    const info = await transporter.sendMail({
        from: `"SDA" hospitalmanagement327@gmail.com`,
        to: email,
        subject: subject,
        html: body,
    }).catch(console.error);

    return info ? info.messageId : null;
}

/* ------------------------STUDENT SIGN UP--------------------*/
module.exports.StudentSignUp = async (req, res) => {
    const { email, department, name, level, ID } = req.body;
    const password = generatePassword();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await Student.create({
            email,
            department,
            name,
            level,
            ID,
            password: hashedPassword
        });

        await sendEmail(
            email,
            'Account Created',
            `<p>Email: ${email}</p><p>ID:${ID}</p><p>Password: ${password}</p>`
        );

        res.status(201).json({
            success: true,
            message: 'Student account created successfully',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
        console.error("Error in StudentSignUp:", error);
    }
};
/* ------------------------END----------------------------------*/

/* ------------------------ADMIN SIGN UP--------------------*/
module.exports.AdminSignUp = async (req, res) => {
    const { email } = req.body;
    const password = generatePassword();
    const ID = generateAdminID();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await Admin.create({
            ID,
            password: hashedPassword,
            email
        });

        await sendEmail(
            email,
            'Account Created',
            `<p>Email: ${email}</p><p>ID:${ID}</p><p>Password: ${password}</p>`
        );

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
        console.error("Error in StudentSignUp:", error);
    }
};
/* ------------------------END----------------------------------*/

/* ------------------------ADMIN SIGN UP--------------------*/
module.exports.HospitalAdminSignUp = async (req, res) => {
    const { email } = req.body;
    const password = generatePassword();
    const ID = generateAdminID();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await HospitalAdmin.create({
            ID,
            password: hashedPassword,
            email
        });

        await sendEmail(
            email,
            'Account Created🎉',
            `<p>Email: ${email}</p><p>ID:${ID}</p><p>Password: ${password}</p>`
        );

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
        console.error("Error in StudentSignUp:", error);
    }
};
/* ------------------------END----------------------------------*/

module.exports.loginStudent = async (req, res) => {
    const { ID, password } = req.body;

    try {
        if (!ID || !password) {
            return res.status(400).json({ success: false, msg: "ID or password cannot be empty" });
        }
        const user = await Student.login(ID, password);
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error during login:", error);
        if (error.message === "Incorrect ID" || error.message === "Incorrect password") {
            return res.status(401).json({ success: false, msg: error.message });
        }
        res.status(500).json({ success: false, msg: "An error occurred during login", error: error.message });
    }
};


module.exports.loginUniversityAdmin = async (req, res) => {
    const { ID, password } = req.body;
    try {
        if (!ID || !password) {
            return res.status(400).json({ success: false, msg: "ID or password cannot be empty" });
        }
        const user = await Admin.login(ID, password);
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error during login:", error);
        if (error.message === "Incorrect ID" || error.message === "Incorrect password") {
            return res.status(401).json({ success: false, msg: error.message });
        }
        res.status(500).json({ success: false, msg: "An error occurred during login", error: error.message });
    }
};


module.exports.loginHospitalAdmin = async (req, res) => {
    const { ID, password } = req.body;
    try {
        if (!ID || !password) {
            return res.status(400).json({ success: false, msg: "ID or password cannot be empty" });
        }
        const user = await HospitalAdmin.login(ID, password);
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error during login:", error);
        if (error.message === "Incorrect ID" || error.message === "Incorrect password") {
            return res.status(401).json({ success: false, msg: error.message });
        }
        res.status(500).json({ success: false, msg: "An error occurred during login", error: error.message });
    }
};


module.exports.createTimetable = async (req, res) => {
    const { content } = req.body;
    try {
        if (!content) {
            return res.status(400).json({ success: false, msg: "invalid input" });
        }
        const timetables = await Timetable.create({ content: content })
        res.status(200).json({ success: true, msg: "time table created" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: error })
    }
};


module.exports.findStudents = async (req, res) => {
    try {
        const student = await Student.find()
        res.status(200).json({ success: true, students: student })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: error })
    }
};
module.exports.findAlltimetable = async (req, res) => {
    try {
        const timetables = await Timetable.find()
        res.status(200).json({ success: true, content: timetables })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: error })
    }
};
// Function to delete a timetable by _id
module.exports.deleteTimetable = async (req, res) => {
    const { id } = req.body;
    try {
        await Timetable.findByIdAndDelete(id);
        res.status(200).json({ success: true, msg: 'Timetable deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: error });
    }
};

module.exports.findTimeTable = async (req, res) => {
    const { id } = req.body;
    try {
        const timetable = await Timetable.findById(id);
        res.status(200).json({ success: true, content: timetable });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: error });
    }
};


module.exports.find_A_Student = async (req, res) => {
    const { id } = req.body;
    try {
        const student = await Student.findById(id);
        res.status(200).json({ success: true, content: student });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: error });
    }
};

module.exports.createAttendance = async (req, res) => {
    try {
        const { StartingTime, EndingTime, Day, Students, level, ward } = req.body;

        // Validate input data
        if (!StartingTime || !EndingTime || !Day || !Students || !Array.isArray(Students) || !level || !ward) {
            return res.status(400).json({ success: false, msg: "Invalid input data" });
        }

        // Create new attendance record
        const newAttendance = new Attendance({
            StartingTime,
            EndingTime,
            Day,
            Students,
            level,
            ward
        });

        // Save the record to the database
        await newAttendance.save();
        res.status(201).json({ success: true, data: newAttendance });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: error.message });
    }
};


module.exports.AssignTimetable = async (req, res) => {
    const { timeTableId, ward, N_Students } = req.body;
    if (!timeTableId || !ward || !N_Students) {
        return res.status(400).json({ success: false, msg: "invalid input" });
    }
    try {
        // Find students with the default timetable value
        const defaultTimetable = {
            timeTableId: "",
            ward: ""
        };
        let students = await Student.find({ timeTable: defaultTimetable });
        // If there are more students than needed, slice the array to get the required number
        if (students.length > N_Students) {
            students = students.slice(0, N_Students);
        }

        // Update each selected student with the new timetableId and ward
        const updatedStudents = students.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: { $set: { timeTable: { timeTableId, ward } } }
            }
        }));
        // Perform bulk update
        await Student.bulkWrite(updatedStudents);
        res.status(200).json({ success: true, message: 'Timetable assigned successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: error.message });
    }
};


module.exports.createAssessment = async (req, res) => {
    try {
        const newAssessment = new StudentAssessment(req.body);
        const savedAssessment = await newAssessment.save();
        res.status(201).json(savedAssessment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


module.exports.createWards = async (req, res) => {
    try {
        const newWard = new Wards(req.body);
        const savedWard = await newWard.save();
        res.status(201).json(savedWard);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteWards = async (req, res) => {
    const { id } = req.body
    try {
        await Wards.findByIdAndDelete(id);
        res.status(200).json({ message: 'Ward deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.findWards = async (req, res) => {
    try {
        const wards = await Wards.find();
        res.status(200).json(wards);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};