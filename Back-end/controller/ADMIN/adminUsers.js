const Users = require("../../models/userSchema")

const getAllUsers = async (req , res) => {
    try{
        const users = await Users.find({} , '-password') 

        if(!users || users.length === 0){
            return res.status(404).json({message : 'No users Found'})
        }
        res.status(200).json(users)
    }catch(error){
        console.error('Error getting users :' , error)
        res.status(500).json({message : "Internal server error"})
    }
}

const getUserbyId = async(req , res) => {
    const userId = req.params.id

    try{
        const user = await Users.findById(userId).select('-password')

        if(!user){
            return res.status(404).json({message : "User not Found"})
        }
        res.status(200).json(user)
    }catch(error) {
        console.error('Error on Fetchingg user',error)
        res.status(500).json({message : "Internal server error"})
    }
}

//-------------------------------------------------------------------------------------------//

const blockAndUnblock= async (req , res) => {
    const userId = req.params.id

    try{
        const user = await Users.findById(userId)

        if(!user){return res.status(404).json({message : 'User not Found'})}

        user.isBlocked = !user.isBlocked;
        await user.save()

        const status = user.isBlocked ? 'blocked' : 'unblocked'
        res.status(200).json({message : `user has been ${status}` , user})
    }catch (err) {
        console.error("block/unblock switch error : " , err)
        res.status(500).json({message : 'Server Error'})
    }
}

module.exports = {getAllUsers,getUserbyId , blockAndUnblock}