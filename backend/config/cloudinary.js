import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async () => {
    const cloud_name = process.env.CLOUDINARY_NAME
    const api_key = process.env.CLOUDINARY_API_KEY
    const api_secret = process.env.CLOUDINARY_API_SECRET_KEY

    if (!cloud_name || !api_key || !api_secret) {
        throw new Error('Cloudinary credentials missing. Set CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY in environment.')
    }

    cloudinary.config({
        cloud_name,
        api_key,
        api_secret,
    })
}

export default connectCloudinary