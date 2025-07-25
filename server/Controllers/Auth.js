const userSchema = require("../Models/Auth");

exports.login = async (request, response) => {
  let { email, name, channelname, description, image, joinedon } = request.body;
  try {
    let existinguser = await userSchema.findOne({ email });
    if (!existinguser) {
      try {
        let newuser = await userSchema.create({
          email,
          name,
          channelname,
          description,
          image,
          joinedon,
        });
        response.status(200).json({ result: newuser });
      } catch (error) {
        response.status(500).json({ message: "Something Went Wrong !" });
        return;
      }
    } else {
      response.status(200).json({ result: existinguser });
    }
  } catch (error) {
    response.status(500).json({ message: "Something Went Wrong !" });
    return;
  }
};
