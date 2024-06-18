const Controller = require("../controller/Controller")
const express = require('express')
const route = express.Router()
route.post('/student-sign-up', Controller.StudentSignUp)
route.post('/admin-sign-up', Controller.AdminSignUp)
route.post('/hospital-admin-sign-up', Controller.HospitalAdminSignUp)
route.post('/login-student', Controller.loginStudent)
route.post('/login-university-admin', Controller.loginUniversityAdmin)
route.post('/login-hospital-admin', Controller.loginHospitalAdmin)
route.post('/create-timetable', Controller.createTimetable)
route.get('/find-timetable', Controller.findAlltimetable)
route.post('/delete-timetable', Controller.deleteTimetable)
route.get('/find-students', Controller.findStudents)
route.post('/assign-timetable', Controller.AssignTimetable)
route.post('/find-a-timetable', Controller.findTimeTable)
route.post('/find-a-student', Controller.find_A_Student)
route.post('/create-attendance', Controller.createAttendance)
route.post('/create-assessment', Controller.createAssessment)
route.post('/create-wards', Controller.createWards)
route.post('/delete-wards', Controller.deleteWards)
route.get('/finds-wards', Controller.findWards)
module.exports = route