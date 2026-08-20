import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from "jsonwebtoken";
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js';

//API for adding the Doctor
const addDoctor =async(req,res)=> {
    try{
        
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
        const imageFile=req.file
        if(!imageFile){
            return res.json({success:false,message:"Image file missing. Upload as form-data field 'image'."});
        }
        
        //checking the presense of all data to addDoctor
        if(!name||!email||!password||!speciality||!degree||!experience||!about||!fees||!address){
            return res.json({success:false,message:"Some details are missing!"});
        }
        
        //validating the email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please Enter the Valid Email!"});
        }

         //validating the strong password
        if(password.length<8){
            return res.json({success:false,message:"Please Enter the strong password!"});
        }

        //hashing the doctor password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //uploading the image to cloudinary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
        const imageUrl=imageUpload.secure_url

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }
        const newDoctor=new doctorModel(doctorData);
        await newDoctor.save()

        res.json({success:true,message:"Doctor Added"})
        
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API for admin login

    const loginAdmin=async(req,res)=>{
        try {
            const {email,password}=req.body

            if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
                const token=jwt.sign(email+password,process.env.JWT_SECRET)
                res.json({success:true,token})
            }else{
                res.json({success:false,message:"Invalid Credentials"})
            }

        } catch (error) {
            console.log(error);
            res.json({success:false,message:error.message})
        }
    }

    //API for getting alal doctors information
    const allDoctors=async(req,res)=>{
        try {
            const doctors=await doctorModel.find({}).select('-password')
            res.json({success:true,doctors})
        } catch (error) {
            console.log(error);
            res.json({success:false,message:error.message})
        }
    }

    //Api for getting all the appointments list

    const appointmentsAdmin=async(req,res)=>{
        try {
            const appointments=await appointmentModel.find({})
            res.json({success:true,appointments})
        } catch (error) {
            console.log(error);
            res.json({success:false,message:error.message})
        }
    }

    //Api for cancelling the appointment

    const appointmentCancel = async (req, res) => {
        try {
            const { appointmentId } = req.body

            const appointmentData = await appointmentModel.findById(appointmentId)

            if (!appointmentData) return res.json({ success: false, message: "Appointment not found" })

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

            // free the booked slot on the doctor
            const { docId, slotDate, slotTime } = appointmentData

            const doctorData = await doctorModel.findById(docId)
            if (doctorData) {
                const slots_booked = doctorData.slots_booked || {}
                if (slots_booked[slotDate]) {
                    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
                }
                await doctorModel.findByIdAndUpdate(docId, { slots_booked })
            }

            res.json({ success: true, message: "Appointment Cancelled!" })
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message })
        }
    }

    //Api to get the dashboard data for the admin panel
    const adminDashboard=async(req,res)=>{
        try {
            const doctors=await doctorModel.find({})
            const users=await userModel.find({})
            const appointments=await appointmentModel.find({})

            const dashData={
                doctors:doctors.length,
                patients:users.length,
                appointments:appointments.length,
                latestAppointments:appointments.reverse().slice(0,5)
            }

            res.json({success:true,dashData})
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message })
        }
    }


export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}